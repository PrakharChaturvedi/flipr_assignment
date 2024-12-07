import express from 'express';
import { addProduct, updateProduct, deleteProduct, getAllProducts } from '../controller/productController.js';

const router = express.Router();

// Routes
router.post('/addproduct', addProduct);
router.put('/updateproduct/:productId', updateProduct);
router.delete('/deleteproduct/:productId', deleteProduct);
router.get('/products', getAllProducts);

export default router; 
