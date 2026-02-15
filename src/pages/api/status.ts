import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import mongoose from 'mongoose';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await dbConnect();

        // Check if the connection is ready
        const isConnected = mongoose.connection.readyState === 1;

        if (isConnected) {
            return res.status(200).json({ status: 'ok' });
        } else {
            return res.status(503).json({ status: 'error', message: 'MongoDB is not connected' });
        }
    } catch (error: any) {
        console.error('Database connection error:', error);
        return res.status(503).json({ status: 'error', message: error.message || 'Database connection failed' });
    }
}
