import express from 'express';
import { placeOrder, getAllOrders, getOrdersByCustomerId } from '../controller/orderController.js';


const router = express.Router();

// Routes
router.post('/placeorder', placeOrder);
router.get('/getallorders', getAllOrders);
router.get('/orders/customer/:customerId', getOrdersByCustomerId);

export default router;
