import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri: string = process.env.MONGO_URI ?? '';

if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in .env');
}

export class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }
    try {
      await mongoose.connect(mongoUri);
      this.isConnected = true;
      console.log('Connected to MongoDB Atlas');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
}
