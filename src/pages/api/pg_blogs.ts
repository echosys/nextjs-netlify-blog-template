import { NextApiRequest, NextApiResponse } from 'next';
import { pgDb } from '../../lib/pg';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'GET') {
            const { tag, id } = req.query;

            if (id) {
                const result = await pgDb.query('SELECT * FROM posts WHERE id = $1', [id]);
                return res.status(200).json(result.rows[0] || null);
            }

            let query = 'SELECT id, title, content, attachment_name, tags, created_at FROM posts';
            const params: any[] = [];
            if (tag && tag !== 'all') {
                query += ' WHERE $1 = ANY(tags)';
                params.push(tag);
            }
            query += ' ORDER BY created_at DESC';
            const result = await pgDb.query(query, params);
            const tagsResult = await pgDb.query('SELECT DISTINCT unnest(tags) as tag FROM posts ORDER BY tag ASC');
            return res.status(200).json({ posts: result.rows, tags: tagsResult.rows.map((r: any) => r.tag) });

        } else if (req.method === 'POST') {
            const { title, content, tags, attachment_name, attachment_data } = req.body;
            const tagList = Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean);
            const result = await pgDb.query(
                'INSERT INTO posts (title, content, tags, attachment_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
                [title, content, tagList, attachment_name || null]
            );
            const postId = result.rows[0].id;
            if (attachment_data) {
                const CHUNK_SIZE = 1024 * 1024;
                const chunksPost: string[] = [];
                for (let i = 0; i < attachment_data.length; i += CHUNK_SIZE) {
                    chunksPost.push(attachment_data.slice(i, i + CHUNK_SIZE));
                }
                for (let i = 0; i < chunksPost.length; i++) {
                    await pgDb.query(
                        'INSERT INTO post_chunks (post_id, chunk_index, data) VALUES ($1, $2, $3)',
                        [postId, i, chunksPost[i]]
                    );
                }
            }
            return res.status(201).json({ id: postId });

        } else if (req.method === 'PUT') {
            const { id, title, content, tags, attachment_name, attachment_data, clear_attachment } = req.body;
            const tagList = Array.isArray(tags) ? tags : (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean);

            if (clear_attachment) {
                await pgDb.query(
                    'UPDATE posts SET title=$1, content=$2, tags=$3, attachment_name=$4 WHERE id=$5',
                    [title, content, tagList, null, id]
                );
                await pgDb.query('DELETE FROM post_chunks WHERE post_id=$1', [id]);
            } else {
                await pgDb.query(
                    'UPDATE posts SET title=$1, content=$2, tags=$3, attachment_name=$4 WHERE id=$5',
                    [title, content, tagList, attachment_name || null, id]
                );
            }

            if (attachment_data) {
                await pgDb.query('DELETE FROM post_chunks WHERE post_id=$1', [id]);
                const CHUNK_SIZE = 1024 * 1024;
                const chunksPut: string[] = [];
                for (let i = 0; i < attachment_data.length; i += CHUNK_SIZE) {
                    chunksPut.push(attachment_data.slice(i, i + CHUNK_SIZE));
                }
                for (let i = 0; i < chunksPut.length; i++) {
                    await pgDb.query(
                        'INSERT INTO post_chunks (post_id, chunk_index, data) VALUES ($1, $2, $3)',
                        [id, i, chunksPut[i]]
                    );
                }
            }
            return res.status(200).json({ success: true });

        } else if (req.method === 'DELETE') {
            const { id } = req.query;
            await pgDb.query('DELETE FROM post_chunks WHERE post_id=$1', [id]);
            await pgDb.query('DELETE FROM posts WHERE id=$1', [id]);
            return res.status(200).json({ success: true });

        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error: any) {
        console.error('PG API error:', error);
        return res.status(500).json({ error: error.message });
    }
}
