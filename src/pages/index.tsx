import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [login, setLogin] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', attachment: '', attachmentName: '', tags: '' });
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [dbStatus, setDbStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    setIsAuth(document.cookie.includes('auth=true'));
    checkDbStatus();
  }, []);

  const checkDbStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        setDbStatus('ok');
      } else {
        setDbStatus('error');
      }
    } catch (err) {
      setDbStatus('error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, pw }),
      });

      if (res.ok) {
        showNotification('Welcome back!');
        router.push('/posts');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Login failed', 'error');
      }
    } catch (err) {
      showNotification('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name;
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBlog({ ...newBlog, attachment: reader.result as string, attachmentName: fileName });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog),
      });
      if (res.ok) {
        setNewBlog({ title: '', content: '', attachment: '', attachmentName: '', tags: '' });
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        showNotification('Blog created successfully!');
      } else {
        showNotification('Failed to create blog', 'error');
      }
    } catch (error) {
      showNotification('An error occurred', 'error');
    }
  };

  return (
    <Layout>
      <BasicMeta url={"/"} />
      <OpenGraphMeta url={"/"} />
      <TwitterCardMeta url={"/"} />
      <div className="container">
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {!isAuth ? (
          <div className="login-wrapper">
            <div className="login-card">
              <h1>Welcome Back</h1>
              <p className="subtitle">
                Build: {process.env.NEXT_PUBLIC_BUILD_TIME}<br />
                Commit: {process.env.NEXT_PUBLIC_GIT_COMMIT}
              </p>

              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <label htmlFor="login">Username</label>
                  <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="pw">Password</label>
                  <input
                    id="pw"
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="status-indicator-container">
                  <span className={`status-dot ${dbStatus}`}></span>
                  <span className="status-text">
                    Database: {dbStatus === 'loading' ? 'Checking...' : dbStatus === 'ok' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <button type="submit" disabled={loading || dbStatus === 'error'} className="login-btn">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="create-blog-form">
            <h1>Create New Blog</h1>
            <input
              type="text"
              placeholder="Title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tags (comma separated, e.g. news, tech, design)"
              value={newBlog.tags}
              onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
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
              {newBlog.attachmentName && <p className="file-name">Selected: {newBlog.attachmentName}</p>}
            </div>
            <button className="save-btn" onClick={handleSave}>Save</button>
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          padding: 2rem;
          min-height: 80vh;
        }
        .login-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: 4rem;
        }
        .login-card {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 400px;
          border: 1px solid #f0f0f0;
        }
        .login-card h1 {
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
          color: #111;
          text-align: center;
        }
        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 2rem;
          font-size: 0.8rem;
          line-height: 1.4;
          font-family: monospace;
          background: #f4f4f4;
          padding: 0.5rem;
          border-radius: 4px;
        }
        .input-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
          font-size: 0.9rem;
        }
        .login-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .status-indicator-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem;
          background: #f8f9fa;
          border-radius: 6px;
          font-size: 0.85rem;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .status-dot.loading {
          background-color: #ffc107;
          animation: pulse 1.5s infinite;
        }
        .status-dot.ok {
          background-color: #28a745;
          box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
        }
        .status-dot.error {
          background-color: #dc3545;
          box-shadow: 0 0 5px rgba(220, 53, 69, 0.5);
        }
        .status-text {
          color: #666;
          font-weight: 500;
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .login-btn:hover:not(:disabled) {
          background-color: #0051bb;
        }
        .login-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
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
        .notification.success {
          background-color: #28a745;
        }
        .notification.error {
          background-color: #dc3545;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .file-name {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
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
        input:focus, textarea:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
        }
        .save-btn {
          padding: 0.5rem 2rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }
        .save-btn:hover {
          background: #0051bb;
        }
      `}</style>
    </Layout>
  );
}
