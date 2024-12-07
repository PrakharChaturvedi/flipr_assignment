// orderController.js
import { Cart } from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import crypto from 'crypto';

// Place Order
const placeOrder = async (req, res) => {
    try {
        const { userId, shippingDetails } = req.body;

        // Validate input
        if (!userId || !shippingDetails || !shippingDetails.address) {
            return res.status(400).json({ error: 'Invalid input data.' });
        }

        // Check if the cart exists and is not empty
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty or does not exist.' });
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + item.productId.price * item.quantity;
        }, 0);

        // Generate unique order ID
        const orderId = crypto.randomBytes(8).toString('hex');

        // Create order
        const order = new Order({
            orderId,
            userId,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price,
            })),
            shippingDetails,
            totalAmount,
        });

        await order.save();

        // Clear the user's cart
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({
            message: 'Order placed successfully.',
            orderId,
            totalAmount,
            shippingDetails,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get All Orders
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const filter = status ? { status } : {};

        // Pagination and filtering
        const orders = await Order.find(filter)
            .populate('userId', 'name email')
            .populate('items.productId', 'name price')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalOrders = await Order.countDocuments(filter);

        res.status(200).json({
            orders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Orders by Customer ID
const getOrdersByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Fetch orders for the customer with pagination
        const orders = await Order.find({ userId: customerId })
            .populate('items.productId', 'name price')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalOrders = await Order.countDocuments({ userId: customerId });

        res.status(200).json({
            orders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { placeOrder, getAllOrders, getOrdersByCustomerId };
