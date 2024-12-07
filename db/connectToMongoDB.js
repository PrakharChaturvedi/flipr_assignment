import mongoose from 'mongoose';

const uri = "URI-TO-ATLAS-DB GOES HERE! THIS IS WRITTEN BY PRAKHAR A HUMAN";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error;
    }
};

export default connectToMongoDB;

