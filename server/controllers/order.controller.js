import Stripe from '../config/stripe.js';
import CartProductModel from '../models/cartproduct.model.js';
import OrderModel from './../models/order.model.js';
import UserModel from './../models/user.model.js';
import mongoose from 'mongoose';



 export async function CashOnDeliveryController(request,response){
    try {
        const userId = request.userId // middleware auth
        const { list_items,totalAmt, addressId,subTotalAmt } = request.body
       
        const payload = list_items.map(el => {
            return ({
                userId:userId, 
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: el.productId._id,
                product_details: { 
                    name : el.productId.name, 
                    image : el.productId.image,
                },
                paymentId: "",
                payment_status: "CASH ON DELIVERY",
                delivery_address: addressId,
                subTotalAmt: subTotalAmt,
                totalAmt:totalAmt,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)
        
        // remove from the cart 
        const removeCartItems = await CartProductModel.deleteMany({userId: userId })
        const updateInUser = await UserModel.updateOne({ _id : userId}, {shopping_cart : []})

        return response.json({
            message : "Order Successfull",
            error:false,
            success: true,
            data:generatedOrder,
            // removeCartItems,
            // updateInUser
        })
        

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const pricewithDiscount = (price,dis = 1) =>{
    const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmount)
    return actualPrice 
}

export async function paymentController(request,response){
    try {
        const userId = request.userId //auth middleware
        const { list_items,totalAmt, addressId,subTotalAmt } = request.body
        
        const user = await UserModel.findById(userId)

        const line_items = list_items.map(item =>{
            return {
                price_data : {
                    currency : 'inr',
                    product_data : {
                        name: item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100
                },
                adjustable_quantity : {
                    enabled : true,
                    minimum : 1
                },
                quantity : item.quantity
            }
        })
        
        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId,
                // totalAmt:totalAmt,
                // subTotalAmt:subTotalAmt
            },
            line_items :line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`,
        }
        const session= await Stripe.checkout.sessions.create(params)
        
        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error:true,
            success:false
        })
    }
}

const getOrderProductItems = async({  
    lineItems,
    userId,
    addressId ,
    paymentId,
    payment_status ,})=>{
    const productList = []
    if(lineItems?.data?.length){
        for (const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            

            const payload = {
                userId:userId, 
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: product.metadata.productId,
                product_details: { 
                    name : product.name, 
                    image : product.images,
                },
                paymentId:paymentId,
                payment_status: payment_status,
                delivery_address: addressId,
                subTotalAmt: Number(item.amount_total / 100),
                totalAmt: Number(item.amount_total / 100),
            }
            productList.push(payload)
        }
    }
    return productList
}

// http://localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const event = request.body;

    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY
    

    console.log("event",event)
    
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
            lineItems :lineItems,
            userId :userId,
            addressId :session.metadata.addressId,
            paymentId:session.payment_intent,
            payment_status : session.payment_status,
            
        })
        
      
      const order = await OrderModel.insertMany(orderProduct)

      if(Boolean(order[0])){
        const removeCartItems = await UserModel.findByIdAndUpdate(userId,{
            shopping_cart : [],
            // removeCartItems
        })
        const removeCartProductDB = await CartProductModel.deleteMany({userId :userId})
        // removeCartProductDB
      }

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
    // Return a response to acknowledge receipt of the event
  response.json({received: true});

}

export async function getOrderDetailsController(request,response) {
    try {
        const userId = request.userId //order id

        const orderlist = await OrderModel.find({ userId : userId}).sort({createdAt :-1}).populate('delivery_address')

        return response.json({
            message : "Order List",
            data : orderlist,
            error : false,
            success :true
        })
    } catch (error) {
        return response.status(500).json({
           message :error.message || error,
           error: true,
           success:false 
        })
    }
}

// import Stripe from '../config/stripe.js';
// import CartProductModel from '../models/cartproduct.model.js';
// import OrderModel from './../models/order.model.js';
// import UserModel from './../models/user.model.js';
// import mongoose from 'mongoose';

// export async function CashOnDeliveryController(request, response) {
//     try {
//         const userId = request.userId; // middleware auth
//         const { list_items, totalAmt, addressId, subTotalAmt } = request.body;
       
//         const payload = list_items.map(el => {
//             return ({
//                 userId: userId, 
//                 orderId: `ORD-${new mongoose.Types.ObjectId()}`,
//                 productId: el.productId._id,
//                 product_details: { 
//                     name: el.productId.name, 
//                     image: el.productId.image,
//                 },
//                 paymentId: "",
//                 payment_status: "CASH ON DELIVERY",
//                 delivery_address: addressId,
//                 subTotalAmt: subTotalAmt,
//                 totalAmt: totalAmt,
//             })
//         });

//         const generatedOrder = await OrderModel.insertMany(payload);
        
//         // Remove from the cart 
//         const removeCartItems = await CartProductModel.deleteMany({ userId: userId });
//         const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

//         return response.json({
//             message: "Order Successfull",
//             error: false,
//             success: true,
//             data: generatedOrder
//         });

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         });
//     }
// }

// export const pricewithDiscount = (price, dis = 1) => {
//     const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
//     const actualPrice = Number(price) - Number(discountAmount);
//     return actualPrice;
// }

// export async function paymentController(request, response) {
//     try {
//         const userId = request.userId; //auth middleware
//         const { list_items, totalAmt, addressId, subTotalAmt } = request.body;
        
//         const user = await UserModel.findById(userId);

//         const line_items = list_items.map(item => {
//             return {
//                 price_data: {
//                     currency: 'inr',
//                     product_data: {
//                         name: item.productId.name,
//                         images: item.productId.image,
//                         metadata: {
//                             productId: item.productId._id
//                         }
//                     },
//                     unit_amount: pricewithDiscount(item.productId.price, item.productId.discount) * 100
//                 },
//                 adjustable_quantity: {
//                     enabled: true,
//                     minimum: 1
//                 },
//                 quantity: item.quantity
//             }
//         });
        
//         const params = {
//             submit_type: 'pay',
//             mode: 'payment',
//             payment_method_types: ['card'],
//             customer_email: user.email,
//             metadata: {
//                 userId: userId,
//                 addressId: addressId
//             },
//             line_items: line_items,
//             success_url: `${process.env.FRONTEND_URL}/success`,
//             cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//         };
        
//         const session = await Stripe.checkout.sessions.create(params);
        
//         return response.status(200).json(session);

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         });
//     }
// }

// const getOrderProductItems = async ({ lineItems, userId, addressId, paymentId, payment_status }) => {
//     const productList = [];
//     if (lineItems?.data?.length) {
//         for (const item of lineItems.data) {
//             const product = await Stripe.products.retrieve(item.price.product);

//             const payload = {
//                 userId: userId, 
//                 orderId: `ORD-${new mongoose.Types.ObjectId()}`,
//                 productId: product.metadata.productId,
//                 product_details: { 
//                     name: product.name, 
//                     image: product.images,
//                 },
//                 paymentId: paymentId,
//                 payment_status: payment_status,
//                 delivery_address: addressId,
//                 subTotalAmt: Number(item.amount_total / 100),
//                 totalAmt: Number(item.amount_total / 100),
//             };
//             productList.push(payload);
//         }
//     }
//     return productList;
// }

// // Stripe webhook to handle payment success
// export async function webhookStripe(request, response) {
//     const event = request.body;
//     const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

//     // Log received event for debugging
//     console.log('Received Stripe event:', event);

//     // Handle the event
//     switch (event.type) {
//         case 'checkout.session.completed':
//             const session = event.data.object;
//             console.log('Checkout session completed:', session);

//             // List the line items in the session
//             const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
//             console.log('Line items from session:', lineItems);

//             const userId = session.metadata.userId;

//             // Get order items based on the line items from the session
//             const orderProduct = await getOrderProductItems({
//                 lineItems: lineItems,
//                 userId: userId,
//                 addressId: session.metadata.addressId,
//                 paymentId: session.payment_intent,
//                 payment_status: session.payment_status,
//             });

//             // Create the order
//             const order = await OrderModel.insertMany(orderProduct);
//             console.log('Order created:', order);

//             // Only proceed if the order was created successfully
//             if (Boolean(order[0])) {
//                 try {
//                     // Clear the cart for the user only after a successful payment
//                     console.log('Clearing cart for user:', userId);

//                     // First, empty the shopping_cart field in the User model
//                     const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
//                         shopping_cart: []
//                     });
//                     console.log('User cart after clearing:', removeCartItems);

//                     // Then, delete the items from the CartProductModel
//                     const removeCartProductDB = await CartProductModel.deleteMany({ userId: userId });
//                     console.log('Cart products after deletion:', removeCartProductDB);

//                 } catch (error) {
//                     console.error('Error clearing cart after Stripe payment:', error);
//                 }
//             }
//             break;

//         default:
//             console.log(`Unhandled event type ${event.type}`);
//     }

//     // Return a response to acknowledge receipt of the event
//     response.status(200).json({ received: true });
// }


// export async function getOrderDetailsController(request, response) {
//     try {
//         const userId = request.userId; //order id

//         const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address');

//         return response.json({
//             message: "Order List",
//             data: orderlist,
//             error: false,
//             success: true
//         });
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         });
//     }
// }
