'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Briefcase, GraduationCap, Users, Plus, X, Search, MapPin, Clock, Filter, Code, BarChart, Loader2, Zap, ArrowRight, Check } from 'lucide-react';
import ApplyGigModal from '@/components/marketplace/ApplyGigModal';
import CreateGigModal from '@/components/marketplace/CreateGigModal';
import { formatDistanceToNow } from 'date-fns';
import { SkeletonList } from '@/components/ui/Skeleton';

interface Gig {
    _id: string;
    title: string;
    description: string;
    compensation: string;
    type: string;
    skillsRequired?: string[]; // Assuming we might add this to schema later
    poster: {
        _id: string;
        name: string;
        role: string;
        department?: string;
    };
    createdAt: string;
    applicants: any[];
}

export default function MarketplacePage() {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [query, setQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Filters for the horizontal scroll
    const filters = ['All', 'Faculty Projects', 'Student Collabs', 'Hackathon Teams', 'Internships'];

    const fetchGigs = async () => {
        setLoading(true);
        try {
            const [resGigs, resUser] = await Promise.all([
                fetch('/api/gigs'),
                fetch('/api/auth/me')
            ]);
            const dataGigs = await resGigs.json();
            const dataUser = await resUser.json();

            if (dataGigs.gigs) setGigs(dataGigs.gigs);
            if (dataUser.user) setCurrentUserId(dataUser.user._id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGigs();
    }, []);

    const filteredGigs = gigs.filter(gig => {
        // Category filter
        if (filter === 'Faculty Projects' && gig.type !== 'faculty_project') return false;
        if (filter === 'Student Collabs' && gig.type !== 'student_collab') return false;

        // Free-text search across title, description, skills and poster
        const q = query.trim().toLowerCase();
        if (!q) return true;

        return (
            gig.title?.toLowerCase().includes(q) ||
            gig.description?.toLowerCase().includes(q) ||
            gig.compensation?.toLowerCase().includes(q) ||
            gig.poster?.name?.toLowerCase().includes(q) ||
            gig.skillsRequired?.some((s) => s.toLowerCase().includes(q))
        );
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <header className="bg-white/85 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 pt-4 pb-2 px-4">
                <div className="max-w-md mx-auto flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 leading-tight tracking-tight">
                            <Briefcase className="h-5 w-5 text-[#800000]" /> Marketplace
                        </h1>
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Gigs, projects & collaborations</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Post an opportunity"
                        className="bg-[#800000] text-white p-2.5 rounded-full shadow-lg shadow-[#800000]/20 hover:bg-[#600000] transition-colors active:scale-95"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                {/* Horizontal Scrollable Filters */}
                <div className="max-w-md mx-auto flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border
                                ${filter === f
                                    ? 'bg-[#800000] text-white border-[#800000] shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <main className="p-4 max-w-md mx-auto space-y-4">
                {/* Search Bar Placeholder */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search roles, skills, people…"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-3 text-sm focus:outline-none focus:border-[#800000] focus:ring-4 focus:ring-[#800000]/10 shadow-sm transition-all"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery('')}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {loading ? (
                    <SkeletonList count={3} />
                ) : filteredGigs.length === 0 ? (
                    <div className="text-center py-16 px-6 animate-fade-in">
                        <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                            <Briefcase className="h-7 w-7 text-slate-400" />
                        </div>
                        <p className="text-slate-700 font-semibold mb-1">No opportunities found</p>
                        <p className="text-slate-400 text-sm">
                            {query
                                ? `Nothing matches “${query}”. Try a different search.`
                                : 'Nothing posted in this category yet — be the first.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3 stagger">
                        {filteredGigs.map(gig => (
                            <GigCard key={gig._id} gig={gig} currentUserId={currentUserId} />
                        ))}
                        <div className="h-10"></div> {/* Bottom spacer */}
                    </div>
                )}
            </main>

            <CreateGigModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPostCreated={fetchGigs} />
            <Navbar />
        </div>
    );
}

function GigCard({ gig, currentUserId }: { gig: Gig, currentUserId: string | null }) {
    const isFaculty = gig.type === 'faculty_project';
    const hasApplied = (gig as any).applicants?.some((a: any) => a.user === currentUserId);
    const [applied, setApplied] = useState(hasApplied);
    const [showApplyModal, setShowApplyModal] = useState(false);

    const handleApplyClick = () => {
        if (!currentUserId) {
            alert('Please login to apply!');
            return;
        }
        if (applied) return;
        setShowApplyModal(true);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            {/* Context Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md
                        ${isFaculty ? 'bg-gradient-to-br from-violet-600 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
                        {gig.poster.name[0]}
                    </span>
                    <div>
                        <p className="text-xs font-bold text-slate-700">{gig.poster.name}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> {formatDistanceToNow(new Date(gig.createdAt))} ago
                        </p>
                    </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm
                    ${isFaculty ? 'bg-violet-50 text-violet-700 border-violet-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                    {gig.type.replace('_', ' ')}
                </span>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight flex-1">{gig.title}</h3>
                    {hasApplied && (
                        <span className="bg-green-100 text-green-700 p-1.5 rounded-full">
                            <Check className="h-4 w-4" />
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        <Zap className="h-3.5 w-3.5" /> {gig.compensation}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-xs font-medium border border-slate-100">
                        <Users className="h-3.5 w-3.5" /> {gig.applicants?.length || 0} Applicants
                    </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                    {gig.skillsRequired?.map((skill: string) => (
                        <span key={skill} className="px-2 py-1 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded-md uppercase tracking-wide">
                            {skill}
                        </span>
                    ))}
                    {!gig.skillsRequired?.length && (
                        <span className="px-2 py-1 bg-white border border-slate-200 text-slate-400 text-[10px] font-medium rounded-md italic">
                            No Specific Skills Listed
                        </span>
                    )}
                </div>

                <p className="text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed">
                    {gig.description}
                </p>

                <button
                    onClick={handleApplyClick}
                    disabled={applied || currentUserId === gig.poster._id}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2
                        ${applied
                            ? 'bg-green-50 border border-green-200 text-green-700 cursor-default shadow-none'
                            : currentUserId === gig.poster._id
                                ? 'bg-slate-50 border border-slate-200 text-slate-400 cursor-default shadow-none'
                                : 'bg-[#800000] text-white hover:bg-[#600000] shadow-[#800000]/20'}`}
                >
                    {applied ? 'Application Sent' : currentUserId === gig.poster._id ? 'You Posted This' : 'Apply For Position'}
                    {!applied && currentUserId !== gig.poster._id && <ArrowRight className="h-4 w-4" />}
                </button>
            </div>

            <ApplyGigModal
                isOpen={showApplyModal}
                onClose={() => setShowApplyModal(false)}
                gig={gig} // Passing full gig object now
                onSuccess={() => setApplied(true)}
            />
        </div>
    );
}
