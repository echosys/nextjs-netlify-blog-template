import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    if (!uri) throw new Error('Please add your Mongo URI to .env.local');
    const client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  if (!uri) {
    // Return a rejected promise instead of throwing at module load time
    // so the build doesn't fail when MONGODB_URI is not set
    clientPromise = Promise.reject(new Error('MONGODB_URI is not set'));
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
