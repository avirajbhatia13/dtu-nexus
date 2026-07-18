'use client';

import { useState } from 'react';
import { Loader2, X, Send, Briefcase, MapPin, Zap, User } from 'lucide-react';

interface ApplyGigModalProps {
    isOpen: boolean;
    onClose: () => void;
    gig: {
        _id: string;
        title: string;
        description: string;
        compensation: string;
        poster: { name: string; role: string; };
        type: string;
    };
    onSuccess: () => void;
}

export default function ApplyGigModal({ isOpen, onClose, gig, onSuccess }: ApplyGigModalProps) {
    const [message, setMessage] = useState('');
    const [resume, setResume] = useState('');
    const [branch, setBranch] = useState('');
    const [semester, setSemester] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/gigs/${gig._id}/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, resume, branch, semester }),
            });
            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header with Gig Details */}
                <div className="bg-slate-50 border-b border-slate-100 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-violet-200 shadow-sm">
                            {(gig.type || 'Gig').replace('_', ' ')}
                        </span>
                        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-400">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2">{gig.title}</h2>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-3">
                        <span className="flex items-center gap-1 font-medium bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                            <User className="h-3 w-3" /> {gig.poster?.name}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                            <Zap className="h-3 w-3" /> {gig.compensation}
                        </span>
                    </div>

                    <p className="text-sm text-slate-500 line-clamp-2 bg-white/50 p-2 rounded-lg border border-slate-100 italic">
                        "{gig.description}"
                    </p>
                </div>

                <div className="p-6 overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-[#800000]" /> Application Details
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Branch</label>
                                <input
                                    type="text"
                                    placeholder="e.g. CSE"
                                    className="w-full border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#800000] focus:outline-none"
                                    value={branch}
                                    onChange={e => setBranch(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Semester</label>
                                <select
                                    className="w-full border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-[#800000] focus:outline-none bg-white"
                                    value={semester}
                                    onChange={e => setSemester(e.target.value)}
                                    required
                                >
                                    <option value="">Select</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Resume Link</label>
                            <input
                                type="url"
                                placeholder="Drive / LinkedIn / Portfolio URL"
                                className="w-full border p-3 rounded-xl text-sm focus:ring-2 focus:ring-[#800000] focus:outline-none"
                                value={resume}
                                onChange={e => setResume(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Cover Letter / Note
                            </label>
                            <textarea
                                className="w-full border p-3 rounded-xl text-sm h-24 resize-none focus:ring-2 focus:ring-[#800000] focus:outline-none"
                                placeholder="Why are you a good fit?"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                            className="w-full bg-[#800000] text-white p-3.5 rounded-xl font-bold hover:bg-[#600000] disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-red-900/10 active:scale-[0.99] transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Send className="h-4 w-4" /> Submit Application</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
