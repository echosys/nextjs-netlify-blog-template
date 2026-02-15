import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const client = await clientPromise;
        const db = client.db('blog_2026');
        const collection = db.collection('blog_login');

        const result = await collection.findOne({}, { projection: { tags: 1, _id: 0 } });
        const tags = result?.tags || [];

        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
}
