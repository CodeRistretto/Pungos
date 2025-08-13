import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Falta MONGODB_URI');
  await mongoose.connect(uri, { dbName: 'ugc' });
  console.log('MongoDB conectado');
}