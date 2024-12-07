import express from 'express';
import connectToMongoDB from './db/connectToMongoDB.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Server is running and database is connected!');
});

// Use routes for /auth, /products, /cart, and /orders
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

const startServer = async () => {
    try {
        // Connect to the database
        console.log('Connecting to MongoDB...');
        await connectToMongoDB(); 

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
};

startServer();
