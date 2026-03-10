import Link from "next/link";
import { Plus, Tag, Edit2, Download, CheckCircle2, X } from "lucide-react";
import PgDeleteButton from "./PgDeleteButton";
import { pgDb } from "../../lib/pg";

export const dynamic = 'force-dynamic';

async function getPgPosts(tag?: string) {
    try {
        let query = 'SELECT id, title, content, attachment_name, tags, created_at FROM posts';
        const params: any[] = [];
        if (tag && tag !== 'all') {
            query += ' WHERE $1 = ANY(tags)';
            params.push(tag);
        }
        query += ' ORDER BY created_at DESC';
        const result = await pgDb.query(query, params);
        const tagsResult = await pgDb.query('SELECT DISTINCT unnest(tags) as tag FROM posts ORDER BY tag ASC');
        return { posts: result.rows, tags: tagsResult.rows.map((r: any) => r.tag) };
    } catch {
        return { posts: [], tags: [] };
    }
}

export default async function PgBlogPage({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string; success?: string }>;
}) {
    const { tag, success } = await searchParams;
    const selectedTag = tag || 'all';
    const { posts, tags } = await getPgPosts(selectedTag);
    const showSuccess = success === 'true';

    return (
        <div className="space-y-8">
            {showSuccess && (
                <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3 text-teal-400">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">Post saved successfully!</span>
                    </div>
                    <Link href="/pg" className="text-slate-500 hover:text-slate-300">
                        <X size={18} />
                    </Link>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Tag size={14} /> Filter by Tags
                        </h3>
                        <div className="flex flex-wrap md:flex-col gap-2">
                            <Link
                                href="/pg"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTag === 'all' ? 'bg-teal-500 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                            >
                                All Posts
                            </Link>
                            {tags.map((t: string) => (
                                <Link
                                    key={t}
                                    href={`/pg?tag=${t}`}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTag === t ? 'bg-teal-500 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                                >
                                    #{t}
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold capitalize">
                            {selectedTag === 'all' ? 'Latest Posts' : `Posts tagged #${selectedTag}`}
                        </h2>
                        <Link
                            href="/pg/new"
                            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                        >
                            <Plus size={18} /> New Post
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {posts.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                                No posts found for this filter.
                                {!process.env.POSTGRES_URL && (
                                    <p className="mt-2 text-xs text-rose-400">POSTGRES_URL is not set in your environment.</p>
                                )}
                            </div>
                        ) : (
                            posts.map((post: any) => (
                                <article
                                    key={post.id}
                                    className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                                                {post.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags?.map((t: string) => (
                                                    <span key={t} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                                                        #{t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            <Link
                                                href={`/pg/edit/${post.id}`}
                                                className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                            <PgDeleteButton id={post.id} />
                                        </div>
                                    </div>

                                    <p className="text-slate-400 line-clamp-3 mb-6 leading-relaxed whitespace-pre-wrap">
                                        {post.content}
                                    </p>

                                    <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-800/50">
                                        <span className="text-slate-500 font-medium">
                                            {new Date(post.created_at).toLocaleDateString(undefined, {
                                                month: 'short', day: 'numeric', year: 'numeric'
                                            })}
                                        </span>
                                        {post.attachment_name && (
                                            <a
                                                href={`/api/pg_blogs/download/${post.id}`}
                                                download={post.attachment_name}
                                                className="flex items-center gap-2 text-teal-400 bg-teal-400/10 px-3 py-1.5 rounded-full hover:bg-teal-400/20 transition-all font-medium"
                                            >
                                                <Download size={14} />
                                                <span className="truncate max-w-[140px]">{post.attachment_name}</span>
                                            </a>
                                        )}
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
