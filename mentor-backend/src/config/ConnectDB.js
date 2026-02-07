import mongoose from "mongoose";

async function ConnectDB() {
     const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://rajivranjan825410:AscKo2f6Xqgn54SC@cluster0.zt5cw6m.mongodb.net/?appName=mentor';

     await mongoose.connect(MONGODB_URI, {
          dbName: 'mentor-app'
     });
}

export default ConnectDB;
