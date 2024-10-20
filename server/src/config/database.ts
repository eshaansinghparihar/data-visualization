import mongoose from 'mongoose';

const connectDB = async (mongoDbUri: string) => {
    try {
        await mongoose.connect(mongoDbUri || '', {
            // Options
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;
