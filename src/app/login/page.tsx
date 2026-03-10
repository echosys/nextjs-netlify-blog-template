import LoginForm from "./LoginForm";
import { Database } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
    return (
        <div className="max-w-md mx-auto mt-24">
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        Blog Manager
                    </h1>
                    <p className="text-slate-400">Sign in to manage your posts</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}

