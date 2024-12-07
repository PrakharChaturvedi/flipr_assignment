import express from 'express';
import { signUp, signIn } from '../controller/authController.js'; 

const router = express.Router();

// Routes
router.post('/signup', signUp);  
router.post('/signin', signIn);  

export default router;
