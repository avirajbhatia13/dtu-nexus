'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Loader2, Check, Search } from 'lucide-react';

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
}

const ROLES = [
    { value: 'student', label: 'Student' },
    { value: 'club_admin', label: 'Club Admin' },
    { value: 'professor', label: 'Professor' },
    { value: 'admin', label: 'Admin' },
];

const ROLE_STYLES: Record<string, string> = {
    student: 'bg-slate-100 text-slate-600',
    club_admin: 'bg-blue-100 text-blue-700',
    professor: 'bg-purple-100 text-purple-700',
    admin: 'bg-[#800000]/10 text-[#800000]',
};

export default function AdminPage() {
    const router = useRouter();
    const [me, setMe] = useState<AdminUser | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [denied, setDenied] = useState(false);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const meRes = await fetch('/api/auth/me');
                const meData = await meRes.json();
                if (!meData.user || meData.user.role !== 'admin') {
                    setDenied(true);
                    setLoading(false);
                    return;
                }
                setMe(meData.user);

                const res = await fetch('/api/admin/users');
                const data = await res.json();
                if (data.users) setUsers(data.users);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const changeRole = async (userId: string, role: string) => {
        setSavingId(userId);
        setSavedId(null);
        // optimistic update
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Failed to update role');
                // reload to reset optimistic change
                const reload = await fetch('/api/admin/users').then((r) => r.json());
                if (reload.users) setUsers(reload.users);
            } else {
                setSavedId(userId);
                setTimeout(() => setSavedId(null), 1500);
            }
        } catch (e) {
            console.error(e);
            alert('Something went wrong');
        } finally {
            setSavingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#800000]" />
            </div>
        );
    }

    if (denied) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
                <ShieldCheck className="h-12 w-12 text-slate-300" />
                <h1 className="text-xl font-bold text-slate-800">Admins only</h1>
                <p className="text-slate-500 text-sm max-w-xs">
                    You need an admin role to manage user positions.
                </p>
                <button
                    onClick={() => router.push('/feed')}
                    className="bg-[#800000] text-white px-5 py-2.5 rounded-xl font-bold text-sm"
                >
                    Back to Feed
                </button>
            </div>
        );
    }

    const filtered = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(query.toLowerCase()) ||
            u.email?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-[#800000] text-white px-5 pt-8 pb-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="h-6 w-6" />
                        <h1 className="text-2xl font-extrabold tracking-tight">Admin Console</h1>
                    </div>
                    <p className="text-white/70 text-sm">
                        Assign positions to campus members. Roles unlock what a user can post.
                    </p>
                </div>
            </div>

            <main className="max-w-2xl mx-auto p-4">
                {/* Legend */}
                <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
                    <span className={`px-2 py-1 rounded-full font-semibold ${ROLE_STYLES.student}`}>Student — basic access</span>
                    <span className={`px-2 py-1 rounded-full font-semibold ${ROLE_STYLES.club_admin}`}>Club Admin — society posts</span>
                    <span className={`px-2 py-1 rounded-full font-semibold ${ROLE_STYLES.professor}`}>Professor — official posts</span>
                    <span className={`px-2 py-1 rounded-full font-semibold ${ROLE_STYLES.admin}`}>Admin — full control</span>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or email…"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
                    />
                </div>

                <p className="text-xs text-slate-400 mb-2 px-1">{filtered.length} member{filtered.length === 1 ? '' : 's'}</p>

                <div className="space-y-2">
                    {filtered.map((u) => (
                        <div
                            key={u._id}
                            className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3"
                        >
                            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                {u.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                    {u.name}
                                    {me && u._id === me._id && (
                                        <span className="ml-1.5 text-[10px] text-slate-400 font-normal">(you)</span>
                                    )}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{u.email}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`hidden sm:inline text-[10px] px-2 py-1 rounded-full font-semibold capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.student}`}>
                                    {u.role?.replace('_', ' ')}
                                </span>
                                <select
                                    value={u.role}
                                    disabled={savingId === u._id}
                                    onChange={(e) => changeRole(u._id, e.target.value)}
                                    className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-700 outline-none focus:border-[#800000] disabled:opacity-50"
                                >
                                    {ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="w-4">
                                    {savingId === u._id && <Loader2 className="h-4 w-4 animate-spin text-[#800000]" />}
                                    {savedId === u._id && <Check className="h-4 w-4 text-green-600" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Navbar />
        </div>
    );
}
