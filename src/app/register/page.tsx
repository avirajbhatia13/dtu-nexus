'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, GraduationCap, School, Users, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const roles = [
        { id: 'student', label: 'Student', icon: <GraduationCap className="h-5 w-5" />, color: 'bg-blue-50 text-blue-600 border-blue-200' },
        { id: 'professor', label: 'Faculty', icon: <School className="h-5 w-5" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
        { id: 'club_admin', label: 'Society', icon: <Users className="h-5 w-5" />, color: 'bg-violet-50 text-violet-600 border-violet-200' },
        { id: 'admin', label: 'Official', icon: <Building2 className="h-5 w-5" />, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    ];

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Account created! Please log in.');
                router.push('/login');
            } else {
                alert(data.error || 'Registration failed');
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
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 my-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-[#800000] mb-2 tracking-tight">Join Nexus</h1>
                    <p className="text-slate-500 font-medium">Create your university account</p>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Select your Role</label>
                    <div className="grid grid-cols-2 gap-3">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-[0.98]
                                    ${role === r.id
                                        ? `${r.color} ring-2 ring-offset-1 ring-[#800000]/10 shadow-sm border-transparent`
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <div className="mb-1.5">{r.icon}</div>
                                <span className="text-xs font-bold">{r.label}</span>
                                {role === r.id && <div className="absolute top-2 right-2 text-current opacity-20"><CheckCircle2 className="h-4 w-4" /></div>}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 focus:border-[#800000] outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
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
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500 mb-2">Already have an account?</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-[#800000] font-bold hover:underline"
                    >
                        Login here <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
