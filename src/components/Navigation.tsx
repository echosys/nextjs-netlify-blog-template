import Link from "next/link";
import { useRouter } from "next/router";
import Burger from "./Burger";
import { useState, useEffect } from "react";

export default function Navigation() {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(document.cookie.includes('auth=true'));
  }, [router.pathname]);

  const handleLogout = () => {
    document.cookie = "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setIsAuth(false);
    router.push('/');
  };

  return (
    <>
      <Burger active={active} onClick={() => setActive(!active)} />
      <div className={"container " + (active ? "active" : "")}>
        <div className="nav-wrapper">
          <div className="logo-section">
            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              BlogManager
            </span>
          </div>
          <ul>
            {isAuth && (
              <>
                <li>
                  <Link href="/" className={router.pathname === "/" ? "active" : undefined}>
                    new
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts"
                    className={
                      router.pathname === "/posts" ? "active" : undefined
                    }
                  >
                    mongo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts/pg"
                    className={
                      router.pathname === "/posts/pg" ? "active" : undefined
                    }
                  >
                    postgres
                  </Link>
                </li>
                <li className="logout-li">
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
        <style jsx>
          {`
            .container {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 64px;
              display: flex;
              align-items: center;
              background: rgba(15, 23, 42, 0.8);
              backdrop-filter: blur(8px);
              border-bottom: 1px solid rgba(51, 65, 85, 0.5);
              z-index: 50;
              padding: 0 2rem;
            }
            .nav-wrapper {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              max-width: 1200px;
              margin: 0 auto;
            }
            ul {
              display: flex;
              list-style: none;
              margin: 0;
              padding: 0;
              gap: 2rem;
              align-items: center;
            }
            li {
              font-size: 0.9rem;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            li :global(a) {
              color: #94a3b8;
              text-decoration: none;
              transition: color 0.2s;
            }
            li :global(a.active) {
              color: #2dd4bf;
            }
            li :global(a:hover) {
              color: #f1f5f9;
            }
            .logout-btn {
              background: rgba(244, 63, 94, 0.1);
              color: #fb7185;
              border: 1px solid rgba(244, 63, 94, 0.2);
              padding: 0.4rem 1rem;
              border-radius: 8px;
              font-size: 0.8rem;
              cursor: pointer;
              transition: all 0.2s;
            }
            .logout-btn:hover {
              background: #f43f5e;
              color: white;
            }

            @media (max-width: 768px) {
              .container {
                height: auto;
                padding: 1rem;
                flex-direction: column;
                display: none;
              }
              .container.active {
                display: flex;
              }
              ul {
                flex-direction: column;
                margin-top: 2rem;
                width: 100%;
              }
            }
          `}
        </style>
      </div>
    </>
  );
}
