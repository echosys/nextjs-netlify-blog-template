import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('blog_2026');
  const collection = db.collection('blog_entry');

  if (req.method === 'GET') {
    const blogs = await collection.find({}).toArray();
    res.status(200).json(blogs);
  } else if (req.method === 'POST') {
    const { title, content, attachment } = req.body;
    const result = await collection.insertOne({ title, content, attachment, createdAt: new Date() });
    res.status(201).json(result);
  } else if (req.method === 'PUT') {
    const { id, title, content, attachment } = req.body;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, attachment, updatedAt: new Date() } }
    );
    res.status(200).json(result);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
