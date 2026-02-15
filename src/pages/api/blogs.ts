import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('blog_2026');
  const collection = db.collection('blog_entry');

  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const skip = (page - 1) * limit;
    const tag = req.query.tag as string;

    const query = tag ? { tags: tag } : {};

    const blogs = await collection.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(query);

    res.status(200).json({ blogs, total, page, totalPages: Math.ceil(total / limit) });
  } else if (req.method === 'POST') {
    const { title, content, attachment, attachmentName, tags } = req.body;
    const tagList = tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

    const result = await collection.insertOne({
      title,
      content,
      attachment,
      attachmentName,
      tags: tagList,
      createdAt: new Date()
    });

    if (tagList.length > 0) {
      const loginCollection = db.collection('blog_login');
      await loginCollection.updateOne({}, { $addToSet: { tags: { $each: tagList } } });
    }

    res.status(201).json(result);
  } else if (req.method === 'PUT') {
    const { id, title, content, attachment, attachmentName, tags } = req.body;
    const tagList = tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()).filter(Boolean)) : [];

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, content, attachment, attachmentName, tags: tagList, updatedAt: new Date() } }
    );

    if (tagList.length > 0) {
      const loginCollection = db.collection('blog_login');
      await loginCollection.updateOne({}, { $addToSet: { tags: { $each: tagList } } });
    }

    res.status(200).json(result);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID required' });
    const result = await collection.deleteOne({ _id: new ObjectId(id as string) });
    res.status(200).json(result);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
