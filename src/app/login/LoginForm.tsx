"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Database } from "lucide-react";

export default function LoginForm() {
    const [login, setLogin] = useState("");
    const [pw, setPw] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dbStatus, setDbStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
    const router = useRouter();

    const checkDb = async () => {
        setDbStatus('checking');
        try {
            const res = await fetch('/api/status');
            setDbStatus(res.ok ? 'ok' : 'error');
        } catch {
            setDbStatus('error');
        }
    };

    // check DB status on mount
    if (dbStatus === 'idle') {
        // trigger once after render
        setTimeout(checkDb, 0);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login, pw }),
            });

            if (res.ok) {
                router.push("/mongo");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="mb-6 p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Database size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">MongoDB Status</span>
                </div>
                <div className="flex items-center gap-2">
                    {dbStatus === 'checking' && <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />}
                    {dbStatus === 'ok' && (
                        <>
                            <span className="absolute inline-flex w-3 h-3 rounded-full opacity-75 animate-ping bg-teal-400" />
                            <span className="relative inline-flex w-3 h-3 rounded-full bg-teal-400" />
                            <span className="text-xs text-teal-400 font-medium">Connected</span>
                        </>
                    )}
                    {dbStatus === 'error' && (
                        <>
                            <span className="relative inline-flex w-3 h-3 rounded-full bg-rose-500" />
                            <span className="text-xs text-rose-400 font-medium">Disconnected</span>
                        </>
                    )}
                    {dbStatus === 'idle' && <span className="text-xs text-slate-500">Checking...</span>}
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                    <input
                        type="text"
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                        placeholder="Enter your username"
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-slate-600"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                    <input
                        type="password"
                        value={pw}
                        onChange={e => setPw(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors placeholder:text-slate-600"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || dbStatus === 'error'}
                    className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex justify-center items-center gap-2 transition-all shadow-lg shadow-teal-500/20 mt-6"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                        <>
                            <LogIn size={20} />
                            Sign In
                        </>
                    )}
                </button>
            </form>
        </>
    );
}

