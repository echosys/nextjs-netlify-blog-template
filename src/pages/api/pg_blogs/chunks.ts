import { NextApiRequest, NextApiResponse } from 'next';
import { pgDb } from '../../../lib/pg';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id, index } = req.query;
    const { data } = req.body;

    if (!id || index === undefined || !data) {
        return res.status(400).json({ error: 'Missing id, index, or data' });
    }

    try {
        await pgDb.query(
            'INSERT INTO post_chunks (post_id, chunk_index, data) VALUES ($1, $2, $3)',
            [parseInt(id as string), parseInt(index as string), data]
        );
        return res.status(200).json({ success: true });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

