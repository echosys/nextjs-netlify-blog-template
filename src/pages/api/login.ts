import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { login, pw } = req.body;

    if (!login || !pw) {
        return res.status(400).json({ error: 'Login and Password required' });
    }

    const client = await clientPromise;
    const db = client.db('blog_2026');
    const collection = db.collection('blog_login');

    const user = await collection.findOne({ login, pw });

    if (user) {
        // In a real app, use JWT or sessions. For this template, we'll return success.
        // The user mentioned "simple cookie-based auth".
        res.setHeader('Set-Cookie', `auth=true; Path=/; SameSite=Strict; Max-Age=86400`);
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
}
