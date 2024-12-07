import express from 'express';
import { addProductToCart, updateCart, deleteProductFromCart, getCart } from '../controller/cartController.js';


const router = express.Router();

// Routes
router.post('/add', addProductToCart);
router.put('/update', updateCart);
router.delete('/delete', deleteProductFromCart);
router.get('/', getCart);

export default router;
