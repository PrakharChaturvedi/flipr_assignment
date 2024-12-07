import Product from '../models/Product.js';

// Add Product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        // Validate input
        if (!name || !description || !price || !category) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        if (price <= 0) {
            return res.status(400).json({ error: 'Price must be a positive number.' });
        }

        // Create new product
        const newProduct = await Product.create({ name, description, price, category });
        res.status(201).json({ message: 'Product added successfully.', productId: newProduct._id });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        // Validate product ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Update fields
        Object.keys(updates).forEach((key) => {
            product[key] = updates[key];
        });
        await product.save();

        res.status(200).json({ message: 'Product updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate product ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Delete product
        await product.deleteOne();
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get All Products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { addProduct, updateProduct, deleteProduct, getAllProducts };  