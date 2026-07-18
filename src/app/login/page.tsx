'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react'; // Client-side import

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [demoLoading, setDemoLoading] = useState(false);

    const handleGoogleLogin = async () => {
        await signIn("google", { callbackUrl: "/feed" });
    };

    const handleDemoLogin = async () => {
        setDemoLoading(true);
        try {
            const res = await signIn('credentials', {
                email: 'demo@dtu.ac.in',
                password: 'demo1234',
                redirect: false,
            });

            if (res?.error) {
                alert('Demo account not found. Please run the seed first (/api/seed).');
            } else {
                router.push('/feed');
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        } finally {
            setDemoLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false, // Handle redirect manually for error UI
            });

            if (res?.error) {
                alert('Invalid email or password');
            } else {
                router.push('/feed');
                router.refresh(); // Ensure navbar/session updates
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-[#800000] mb-2 tracking-tight">DTU Nexus</h1>
                    <p className="text-slate-500 font-medium">Secure Campus Login</p>
                </div>

                {/* One-Click Demo Login (for interviewers / recruiters) */}
                <button
                    onClick={handleDemoLogin}
                    disabled={demoLoading}
                    className="w-full bg-[#800000] hover:bg-[#600000] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#800000]/20 flex justify-center items-center gap-2 mb-3 active:scale-[0.99]"
                >
                    {demoLoading ? <Loader2 className="animate-spin h-5 w-5" /> : '✨ Try Live Demo (One-Click)'}
                </button>
                <p className="text-center text-xs text-slate-400 mb-6">Instantly explore the portal — no signup needed.</p>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all shadow-sm flex justify-center items-center gap-3 mb-6 active:scale-[0.99]"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign in with DTU ID
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-400 font-medium">Or continue with password</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                            University Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="student@dtu.ac.in"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#800000] hover:bg-[#600000] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#800000]/20 flex justify-center items-center gap-2 active:scale-[0.99] mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Log In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 mb-2">Don't have an account?</p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 text-[#800000] font-bold hover:underline"
                    >
                        Create an Account <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
