import { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import BasicMeta from "../components/meta/BasicMeta";
import OpenGraphMeta from "../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../components/meta/TwitterCardMeta";

interface Blog {
  _id: string;
  title: string;
  content: string;
  attachment?: string;
}

export default function Index() {
  const [newBlog, setNewBlog] = useState({ title: '', content: '', attachment: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBlog({ ...newBlog, attachment: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBlog),
    });
    setNewBlog({ title: '', content: '', attachment: '' });
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    alert('Blog created successfully!');
  };

  return (
    <Layout>
      <BasicMeta url={"/"} />
      <OpenGraphMeta url={"/"} />
      <TwitterCardMeta url={"/"} />
      <div className="container">
        <h1>Create New Blog</h1>
        <input
          type="text"
          placeholder="Title"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
        />
        <textarea
          placeholder="Content"
          value={newBlog.content}
          onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
        />
        <div className="file-input-container">
          <label htmlFor="file-upload">Attachment (zip or single file):</label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        <button onClick={handleSave}>Save</button>
      </div>
      <style jsx>{`
        .container {
          padding: 2rem;
        }
        .file-input-container {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border: 1px dashed #ccc;
          border-radius: 4px;
        }
        .file-input-container label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        input, textarea {
          display: block;
          width: 100%;
          margin-bottom: 1rem;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          margin-right: 1rem;
          padding: 0.5rem 1rem;
        }
      `}</style>
    </Layout>
  );
}
