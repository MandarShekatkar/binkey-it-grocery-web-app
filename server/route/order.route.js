import { Router } from 'express';
import auth from './../middleware/auth.js';
import { CashOnDeliveryController, getOrderDetailsController, paymentController, webhookStripe } from '../controllers/order.controller.js';

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get('/order-list',auth,getOrderDetailsController)
export default orderRouter
