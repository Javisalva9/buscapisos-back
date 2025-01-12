import mongoose from 'mongoose';

export async function connectToDatabase(connectionString: string): Promise<void> {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB database');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export function getDatabaseConnection(): typeof mongoose {
  return mongoose;
}