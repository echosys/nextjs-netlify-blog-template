import { NextApiRequest, NextApiResponse } from 'next';
import { pgDb } from '../../../../lib/pg';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query;

    try {
        const postResult = await pgDb.query(
            'SELECT attachment_name FROM posts WHERE id = $1',
            [id]
        );
        const post = postResult.rows[0];
        if (!post || !post.attachment_name) {
            return res.status(404).json({ error: 'Attachment not found' });
        }

        const chunkResult = await pgDb.query(
            'SELECT data FROM post_chunks WHERE post_id = $1 ORDER BY chunk_index ASC',
            [id]
        );

        const fullData = chunkResult.rows.map((r: any) => r.data).join('');
        const buffer = Buffer.from(fullData, 'base64');

        res.setHeader('Content-Disposition', `attachment; filename="${post.attachment_name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', buffer.length);
        return res.status(200).send(buffer);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}


