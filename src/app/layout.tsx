import type { Metadata } from "next";
import "./globals.css";
import LogoutButton from "./components/LogoutButton";
import ActiveNavLink from "./components/ActiveNavLink";
import { cookies } from "next/headers";


export const metadata: Metadata = {
    title: "Blog Manager",
    description: "Dual-backend blog powered by Next.js, MongoDB & Postgres",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.has("auth");

    return (
        <html lang="en">
            <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased">
                <div className="max-w-6xl mx-auto w-full px-6 py-12 flex-1">
                    <header className="mb-12 border-b border-slate-800 pb-8 flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                                Blog Manager
                            </h1>
                            <p className="text-slate-400 mt-2">MongoDB &amp; Postgres Content Hub</p>
                        </div>
                        {isLoggedIn && (
                            <div className="flex items-center gap-4 flex-wrap">
                                <nav className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                                    <ActiveNavLink href="/mongo">Mongo Blog</ActiveNavLink>
                                    <ActiveNavLink href="/pg">Postgres Blog</ActiveNavLink>
                                </nav>
                                <LogoutButton />
                            </div>
                        )}
                    </header>
                    <main>{children}</main>
                </div>
                <footer className="mt-20 py-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
                    <p>Build: <span className="font-mono text-slate-400">{process.env.NEXT_PUBLIC_BUILD_TIME || 'dev'}</span></p>
                    <p>Commit: <span className="font-mono text-slate-400">{process.env.NEXT_PUBLIC_GIT_COMMIT || 'local'}</span></p>
                </footer>
            </body>
        </html>
    );
}


