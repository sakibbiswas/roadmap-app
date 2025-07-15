// // src/config/db.ts
// import mongoose from 'mongoose';
// import { env } from './env';

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(env.DB_URL);
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };




// import mongoose from 'mongoose';
// import { env } from './env';

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(env.MONGO_URI);
//     console.log('✅ MongoDB Connected');
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error);
//     process.exit(1);
//   }
// };
