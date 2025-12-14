import React, { useState } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js'

const CheckOutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem,fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectedAddress, setSelectedAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

 

  const handleCashOnDelivery = async()=>{
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data : {
          list_items : cartItemsList,
          addressId : addressList[selectedAddress]?._id,
          totalAmt :totalPrice,
          subTotalAmt :totalPrice
        }
      })

      const { data : responseData } = response 

      if(responseData.success){
        toast.success(responseData.message)
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
        navigate('/success',{
          state :{
            text : "Order"
          }
        })
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleOnlinePayment = async()=>{
          try {
            toast.loading("loading")
            const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
            const stripePromise = await loadStripe(stripePublicKey) 

            const response = await Axios({
              ...SummaryApi.payment_url,
              data : {
                list_items : cartItemsList,
                addressId : addressList[selectedAddress]?._id,
                totalAmt :totalPrice,
                subTotalAmt :totalPrice,
              }
            })

            const {data : responseData} = response

            stripePromise.redirectToCheckout({sessionId : responseData.id})
            if(fetchCartItem){
              fetchCartItem()
             }
             if(fetchOrder){
              fetchOrder()
            }

          } catch (error) {
            AxiosToastError(error)
          }
  }

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/* Address */}
          <h3 className="text-lg font-semibold">Choose Your Address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => {
              return (
                <label htmlFor={"address"+index} className={!address.status && "hidden"}>
                <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                  <div>
                    <input type="radio" id={"address"+index} value={index} onChange={(e)=> setSelectedAddress(e.target.value) } name="address" />
                  </div>
                  <div>
                    <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>
                      {address.country} - {address.pincode}
                    </p>
                    <p>{address.mobile}</p>
                  </div>
                </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-20 bg-blue-50 border-2 flex border-dashed justify-center items-center cursor-pointer"
            >
              Add Address
            </div>
          </div>
        </div>
        <div className="w-full max-w-md bg-white py-4 px-2">
          {/* summary */}
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill Details</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Items Total</p>
              <p className="flex items-center gap-2">
                <span className="line-through text-neutral-400">
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Total Quantity</p>
              <p className="flex items-center gap-2">
                {totalQty} {totalQty === 1 ? "Item" : "Items"}
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Deliver Charges</p>
              <p className="flex items-center gap-2">Free</p>
            </div>
            <div className="font-semibold flex items-center justify-between gap-4">
              <p>Grand Total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <button className="py-2 px-4 bg-green-600 text-white font-semibold hover:bg-green-700 rounded" onClick={handleOnlinePayment}>
              Online Payment
            </button>
            <button onClick={handleCashOnDelivery} className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white">
              Cash On Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckOutPage;


// import React, { useState } from "react";
// import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
// import { useGlobalContext } from "../provider/GlobalProvider";
// import AddAddress from "../components/AddAddress";
// import { useSelector, useDispatch } from "react-redux";
// import AxiosToastError from "../utils/AxiosToastError";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { handleAddItemCart } from "../store/cartProduct"; // Import to clear cart

// const CheckOutPage = () => {
//   const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
//   const [openAddress, setOpenAddress] = useState(false);
//   const addressList = useSelector((state) => state.addresses.addressList);
//   const [selectedAddress, setSelectedAddress] = useState(0);
//   const cartItemsList = useSelector((state) => state.cartItem.cart);
//   const navigate = useNavigate();
//   const dispatch = useDispatch(); // Get dispatch to clear cart

//   const handleCashOnDelivery = async () => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.CashOnDeliveryOrder,
//         data: {
//           list_items: cartItemsList,
//           addressId: addressList[selectedAddress]?._id,
//           totalAmt: totalPrice,
//           subTotalAmt: totalPrice,
//         },
//       });

//       const { data: responseData } = response;

//       if (responseData.success) {
//         toast.success(responseData.message);
//         dispatch(handleAddItemCart([])); // Clear the cart
//         if (fetchCartItem) fetchCartItem();
//         if (fetchOrder) fetchOrder();
//         navigate("/success", { state: { text: "Order" } });
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   const handleOnlinePayment = async () => {
//     try {
//       toast.loading("Redirecting to payment...");
  
//       // Load Stripe
//       const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
//       const stripePromise = await loadStripe(stripePublicKey);
  
//       // Debugging log (Check if function is running)
//       console.log("🚀 Sending request to create Stripe payment session...");
  
//       // API request to create Stripe session
//       const response = await Axios({
//         ...SummaryApi.payment_url,
//         data: {
//           list_items: cartItemsList,
//           addressId: addressList[selectedAddress]?._id,
//           totalAmt: totalPrice,
//           subTotalAmt: totalPrice,
//         },
//       });
  
//       // Debugging log (See if we got the response)
//       console.log("✅ Stripe API Response:", response.data);
  
//       const { data: responseData } = response;
  
//       // If no session ID, throw an error
//       if (!responseData.id) {
//         throw new Error("⚠️ Payment session ID is missing. Something is wrong.");
//       }
  
//       // Store flag to track payment
//       localStorage.setItem("paymentPending", "true");
  
//       // Redirect to Stripe checkout
//       await stripePromise.redirectToCheckout({ sessionId: responseData.id });
  
//     } catch (error) {
//       console.error("❌ Stripe Payment Error:", error);
//       AxiosToastError(error);
//     }
//   };
  


//   // const handleOnlinePayment = async () => {
//   //   try {
//   //     toast.loading("loading...");
//   //     const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
//   //     const stripePromise = await loadStripe(stripePublicKey);

//   //     const response = await Axios({
//   //       ...SummaryApi.payment_url,
//   //       data: {
//   //         list_items: cartItemsList,
//   //         addressId: addressList[selectedAddress]?._id,
//   //         totalAmt: totalPrice,
//   //         subTotalAmt: totalPrice,
//   //       },
//   //     });

//   //     const { data: responseData } = response;
//   //     await stripePromise.redirectToCheckout({ sessionId: responseData.id });

//   //     dispatch(handleAddItemCart([])); // Clear cart on successful payment
//   //     if (fetchCartItem) fetchCartItem();
//   //     if (fetchOrder) fetchOrder();
//   //   } catch (error) {
//   //     AxiosToastError(error);
//   //   }
//   // };

//   return (
//     <section className="bg-blue-50">
//       <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
//         <div className="w-full">
//           <h3 className="text-lg font-semibold">Choose Your Address</h3>
//           <div className="bg-white p-2 grid gap-4">
//             {addressList.map((address, index) => (
//               <label key={index} htmlFor={"address" + index} className={!address.status ? "hidden" : ""}>
//                 <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
//                   <div>
//                     <input
//                       type="radio"
//                       id={"address" + index}
//                       value={index}
//                       checked={selectedAddress === index}
//                       onChange={() => setSelectedAddress(index)}
//                       name="address"
//                     />
//                   </div>
//                   <div>
//                     <p>{address.address_line}</p>
//                     <p>{address.city}</p>
//                     <p>{address.state}</p>
//                     <p>{address.country} - {address.pincode}</p>
//                     <p>{address.mobile}</p>
//                   </div>
//                 </div>
//               </label>
//             ))}
//             <div onClick={() => setOpenAddress(true)} className="h-20 bg-blue-50 border-2 flex border-dashed justify-center items-center cursor-pointer">
//               Add Address
//             </div>
//           </div>
//         </div>

//         <div className="w-full max-w-md bg-white py-4 px-2">
//           <h3 className="text-lg font-semibold">Summary</h3>
//           <div className="bg-white p-4">
//             <h3 className="font-semibold">Bill Details</h3>
//             <div className="flex gap-4 justify-between ml-1">
//               <p>Items Total</p>
//               <p className="flex items-center gap-2">
//                 <span className="line-through text-neutral-400">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
//                 <span>{DisplayPriceInRupees(totalPrice)}</span>
//               </p>
//             </div>
//             <div className="flex gap-4 justify-between ml-1">
//               <p>Total Quantity</p>
//               <p>{totalQty} {totalQty === 1 ? "Item" : "Items"}</p>
//             </div>
//             <div className="flex gap-4 justify-between ml-1">
//               <p>Delivery Charges</p>
//               <p>Free</p>
//             </div>
//             <div className="font-semibold flex items-center justify-between gap-4">
//               <p>Grand Total</p>
//               <p>{DisplayPriceInRupees(totalPrice)}</p>
//             </div>
//           </div>
//           <div className="w-full flex flex-col gap-4">
//             <button className="py-2 px-4 bg-green-600 text-white font-semibold hover:bg-green-700 rounded" onClick={handleOnlinePayment}>
//               Online Payment
//             </button>
//             <button onClick={handleCashOnDelivery} className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white">
//               Cash On Delivery
//             </button>
//           </div>
//         </div>
//       </div>
//       {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
//     </section>
//   );
// };

// export default CheckOutPage;
