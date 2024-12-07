// cartController.js

import { Cart } from '../models/Cart.js';
import Product from '../models/Product.js';

// Add Product to Cart
const addProductToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate input
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid input data.' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product is already in cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Product added to cart.', cart });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Cart
const updateCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate input
        if (!userId || !productId || quantity < 0) {
            return res.status(400).json({ error: 'Invalid input data.' });
        }

        // Find cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found.' });
        }

        // Find item in cart
        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ error: 'Product not found in cart.' });
        }

        // Update quantity or remove item if quantity is zero
        if (quantity === 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        } else {
            item.quantity = quantity;
        }

        await cart.save();
        res.status(200).json({ message: 'Cart updated successfully.', cart });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete Product from Cart
const deleteProductFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Validate input
        if (!userId || !productId) {
            return res.status(400).json({ error: 'Invalid input data.' });
        }

        // Find cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found.' });
        }

        // Remove product from cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart.', cart });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Cart
const getCart = async (req, res) => {
    try {
        const { userId } = req.query;

        // Validate input
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        // Find cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: 'Cart is empty.' });
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + item.productId.price * item.quantity;
        }, 0);

        res.status(200).json({ cart, totalAmount });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { addProductToCart, updateCart, deleteProductFromCart, getCart };
