import mongoose from 'mongoose';
import Booking from './src/model/booking.Model.js';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mentor-app');
        console.log('✅ Connected to MongoDB');

        // You might need to adjust the Mentor ID if you know it, or list all
        const bookings = await Booking.find({}).sort({ date: -1 });

        console.log(`Found ${bookings.length} bookings:`);
        bookings.forEach(b => {
            console.log(`- ID: ${b._id}`);
            console.log(`  Mentor: ${b.mentorId}`);
            console.log(`  User: ${b.userId}`);
            console.log(`  Date: ${new Date(b.date).toISOString().split('T')[0]}`);
            console.log(`  Time: ${b.startTime} - ${b.endTime}`);
            console.log(`  Status: ${b.status}`);
            console.log('---');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
