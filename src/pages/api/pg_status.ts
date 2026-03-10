import type { NextApiRequest, NextApiResponse } from 'next';
import { pgDb } from '../../lib/pg';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    if (!process.env.POSTGRES_URL) {
        return res.status(503).json({ status: 'error', message: 'POSTGRES_URL is not configured', host: 'not set' });
    }

    let host = 'unknown';
    try {
        const url = new URL(process.env.POSTGRES_URL);
        host = url.hostname;
    } catch {}

    try {
        await pgDb.query('SELECT 1');
        return res.status(200).json({ status: 'ok', host });
    } catch (error: any) {
        return res.status(503).json({ status: 'error', message: error.message, host });
    }
}

