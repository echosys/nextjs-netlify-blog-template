import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/Layout";
import BasicMeta from "../../components/meta/BasicMeta";
import OpenGraphMeta from "../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../components/meta/TwitterCardMeta";

interface Blog {
  _id: string;
  title: string;
  content: string;
  attachment?: string;
  attachmentName?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export default function Index() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; content: string; attachment?: string; attachmentName?: string; tags: string }>({ title: '', content: '', tags: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isAuth, setIsAuth] = useState(false);

  const url = "/posts";
  const title = "Blog Entries";

  useEffect(() => {
    const authStatus = document.cookie.includes('auth=true');
    setIsAuth(authStatus);
    if (!authStatus) {
      router.push('/');
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchBlogs = async (page: number, tag: string = '') => {
    const res = await fetch(`/api/blogs?page=${page}&limit=15${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`);
    const data = await res.json();
    setBlogs(data.blogs);
    setTotalPages(data.totalPages);
    setCurrentPage(data.page);
  };

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setAllTags(data);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    }
  };

  useEffect(() => {
    fetchBlogs(1, selectedTag);
    fetchTags();
  }, [selectedTag]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (blog: Blog) => {
    setEditingId(blog._id);
    setEditForm({
      title: blog.title,
      content: blog.content,
      attachment: blog.attachment,
      attachmentName: blog.attachmentName,
      tags: blog.tags ? blog.tags.join(', ') : ''
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name;
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, attachment: reader.result as string, attachmentName: fileName });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = () => {
    setEditForm({ ...editForm, attachment: undefined, attachmentName: undefined });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      });
      if (res.ok) {
        setEditingId(null);
        showNotification('Changes saved successfully!');
        fetchBlogs(currentPage, selectedTag);
        fetchTags(); // Sync tags in case new ones were added
      } else {
        showNotification('Failed to save changes', 'error');
      }
    } catch (error) {
      showNotification('An error occurred', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConfirmDeleteId(null);
        showNotification('Blog deleted successfully!');
        fetchBlogs(currentPage, selectedTag);
      } else {
        showNotification('Failed to delete blog', 'error');
      }
    } catch (error) {
      showNotification('An error occurred', 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <div className="page-wrapper">
        <aside className="sidebar">
          <h3>Filter by Tag</h3>
          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <div className="tag-list">
            <button className={selectedTag === '' ? 'active' : ''} onClick={() => setSelectedTag('')}>All</button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={selectedTag === tag ? 'active' : ''}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </aside>

        <main className="container">
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <h1>{selectedTag ? `Blogs tagged: ${selectedTag}` : title}</h1>
          <ul className="blog-list">
            {blogs.map((blog) => (
              <li key={blog._id} className="blog-item">
                {editingId === blog._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={editForm.tags}
                      onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                      placeholder="Tags (comma separated)"
                    />
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      placeholder="Content"
                    />
                    <div className="edit-attachment">
                      {editForm.attachment ? (
                        <div className="current-attachment">
                          <span>Current: {editForm.attachmentName || 'Attachment'}</span>
                          <button className="remove-btn" onClick={handleRemoveAttachment}>Remove</button>
                        </div>
                      ) : (
                        <div className="replace-attachment">
                          <label>Add Attachment:</label>
                          <input type="file" onChange={handleFileChange} />
                        </div>
                      )}
                      {editForm.attachment && (
                        <div className="replace-attachment">
                          <label>Replace Attachment:</label>
                          <input type="file" onChange={handleFileChange} />
                        </div>
                      )}
                    </div>
                    <div className="form-actions">
                      <button onClick={() => handleSaveEdit(blog._id)}>Save Changes</button>
                      <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="blog-header">
                      <div>
                        <h2>{blog.title}</h2>
                        <div className="timestamps">
                          <small>Created: {formatDate(blog.createdAt)}</small>
                          {blog.updatedAt && (
                            <small style={{ marginLeft: '1rem' }}>Updated: {formatDate(blog.updatedAt)}</small>
                          )}
                        </div>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="post-tags">
                            {blog.tags.map(tag => (
                              <span key={tag} className="tag-badge" onClick={() => setSelectedTag(tag)}>#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {isAuth && (
                      <div className="header-actions">
                        <button className="edit-btn" onClick={() => handleEdit(blog)}>Edit</button>
                        <button className="delete-btn" onClick={() => setConfirmDeleteId(blog._id)}>Delete</button>
                      </div>
                    )}

                    {isAuth && confirmDeleteId === blog._id && (
                      <div className="delete-confirmation">
                        <span>Are you sure you want to delete this post?</span>
                        <button className="yes-btn" onClick={() => handleDelete(blog._id)}>Yes</button>
                        <button className="no-btn" onClick={() => setConfirmDeleteId(null)}>No</button>
                      </div>
                    )}

                    <div className={`blog-content ${expanded[blog._id] ? 'expanded' : 'truncated'}`}>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{blog.content}</p>
                    </div>
                    {blog.content.split('\n').length > 5 && (
                      <button className="expand-btn" onClick={() => toggleExpand(blog._id)}>
                        {expanded[blog._id] ? 'Show Less' : 'Expand'}
                      </button>
                    )}
                    {blog.attachment && (
                      <div className="attachment-container">
                        {blog.attachment.startsWith('data:image/') ? (
                          <div className="image-preview">
                            <img src={blog.attachment} alt={blog.title} className="attachment-img" />
                          </div>
                        ) : (
                          <div className="file-icon">📎 Attachment: {blog.attachmentName || 'file'}</div>
                        )}
                        <a
                          href={blog.attachment}
                          download={blog.attachmentName || `attachment_${blog._id}`}
                          className="download-link"
                        >
                          Download Original File
                        </a>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => fetchBlogs(currentPage - 1, selectedTag)}>Prev</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => fetchBlogs(currentPage + 1, selectedTag)}>Next</button>
            </div>
          )}
        </main>
      </div>
      <style jsx>{`
        .page-wrapper {
          display: flex;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          gap: 3rem;
        }
        .sidebar {
          width: 250px;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
          height: fit-content;
          position: sticky;
          top: 2rem;
          border: 1px solid #eee;
        }
        .sidebar h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: #333;
        }
        .sidebar select {
          width: 100%;
          padding: 0.5rem;
          margin-bottom: 1.5rem;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .tag-list button {
          background: white;
          border: 1px solid #ddd;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tag-list button:hover, .tag-list button.active {
          background: #0070f3;
          color: white;
          border-color: #0070f3;
        }
        .container {
          flex: 1;
          max-width: 800px;
        }
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem 2rem;
          border-radius: 4px;
          color: white;
          font-weight: bold;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }
        .notification.success { background-color: #28a745; }
        .notification.error { background-color: #dc3545; }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .blog-list {
          list-style: none;
          padding: 0;
        }
        .blog-item {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }
        .blog-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .blog-header h2 {
          margin: 0 0 0.25rem 0;
        }
        .timestamps {
          color: #888;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
        }
        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.5rem;
        }
        .tag-badge {
          background: #eef6ff;
          color: #0070f3;
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
          cursor: pointer;
        }
        .tag-badge:hover {
          background: #0070f3;
          color: white;
        }
        .header-actions {
          display: flex;
          gap: 0.5rem;
        }
        .blog-content {
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .truncated {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
        }
        .expanded { display: block; }
        
        .expand-btn, .edit-btn, .delete-btn, .pagination button, .edit-form button, .yes-btn, .no-btn, .remove-btn {
          background: none;
          border: 1px solid #0070f3;
          color: #0070f3;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .expand-btn:hover, .edit-btn:hover, .pagination button:hover:not(:disabled), .edit-form button:hover, .yes-btn:hover {
          background: #0070f3;
          color: white;
        }
        .delete-btn, .remove-btn {
          border-color: #dc3545;
          color: #dc3545;
        }
        .delete-btn:hover, .remove-btn:hover, .yes-btn {
          background: #dc3545;
          color: white;
        }
        .yes-btn { border-color: #dc3545; }
        .no-btn { border-color: #666; color: #666; }
        .no-btn:hover { background: #666; color: white; }

        .delete-confirmation {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #fff5f5;
          border: 1px solid #feb2b2;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .edit-form input, .edit-form textarea {
          width: 100%;
          margin-bottom: 1rem;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .edit-form textarea { min-height: 150px; }
        .edit-attachment {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 4px;
        }
        .current-attachment {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .replace-attachment label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.85rem;
          font-weight: bold;
        }
        .form-actions { display: flex; gap: 0.5rem; }
        
        .cancel-btn { border-color: #666 !important; color: #666 !important; }
        .cancel-btn:hover { background: #666 !important; color: white !important; }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #eee;
        }
        .pagination button:disabled {
          border-color: #ccc;
          color: #ccc;
          cursor: not-allowed;
        }
        .attachment-container {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
          border: 1px solid #ddd;
          display: inline-block;
        }
        .attachment-img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }
        .file-icon {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: #666;
        }
        .download-link {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #0070f3;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.2s;
        }
        .download-link:hover { background: #0051bb; }
        .image-preview { margin-bottom: 0.5rem; }

        @media (max-width: 768px) {
          .page-wrapper {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            position: static;
          }
        }
      `}</style>
    </Layout>
  );
}
