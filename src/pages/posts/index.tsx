import { useState, useEffect } from 'react';
import Layout from "../../components/Layout";
import BasicMeta from "../../components/meta/BasicMeta";
import OpenGraphMeta from "../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../components/meta/TwitterCardMeta";

interface Blog {
  _id: string;
  title: string;
  content: string;
  attachment?: string;
}

export default function Index() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const url = "/posts";
  const title = "Blog Entries";

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <div className="container">
        <h1>{title}</h1>
        <ul className="blog-list">
          {blogs.map((blog) => (
            <li key={blog._id} className="blog-item">
              <h2>{blog.title}</h2>
              <p>{blog.content}</p>
              {blog.attachment && (
                <div className="attachment-container">
                  {blog.attachment.startsWith('data:image/') ? (
                    <div className="image-preview">
                      <img src={blog.attachment} alt={blog.title} className="attachment-img" />
                    </div>
                  ) : (
                    <div className="file-icon">📎 Attachment</div>
                  )}
                  <a
                    href={blog.attachment}
                    download={`attachment_${blog._id}${blog.attachment.startsWith('data:application/zip') ? '.zip' : ''}`}
                    className="download-link"
                  >
                    Download Attachment
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
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
        .download-link:hover {
          background: #0051bb;
        }
        .image-preview {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </Layout>
  );
}
