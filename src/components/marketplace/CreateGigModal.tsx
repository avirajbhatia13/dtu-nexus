'use client';

import { useState } from 'react';
import { X, Briefcase, DollarSign, Loader2 } from 'lucide-react';

interface CreateGigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: () => void;
}

export default function CreateGigModal({ isOpen, onClose, onPostCreated }: CreateGigModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [compensation, setCompensation] = useState('');
    const [skills, setSkills] = useState('');
    const [type, setType] = useState('student_collab');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);

            const res = await fetch('/api/gigs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    compensation,
                    type,
                    skillsRequired: skillsArray
                }),
            });

            if (res.ok) {
                setTitle('');
                setDescription('');
                setCompensation('');
                setSkills('');
                onPostCreated();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create post');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-[#800000]" />
                        Post Opportunity
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Frontend Developer for Hackathon"
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all text-sm font-medium"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Type</label>
                            <select
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all text-sm"
                                value={type}
                                onChange={e => setType(e.target.value)}
                            >
                                <option value="student_collab">Student Collab</option>
                                <option value="faculty_project">Faculty Project</option>
                                <option value="internship">Internship</option>
                                <option value="freelance">Freelance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Compensation</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Paid / Unpaid"
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all text-sm"
                                    value={compensation}
                                    onChange={e => setCompensation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Skills Required</label>
                        <input
                            type="text"
                            placeholder="React, Node.js, TypeScript (comma separated)"
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all text-sm font-medium"
                            value={skills}
                            onChange={e => setSkills(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Description</label>
                        <textarea
                            placeholder="Describe the role, requirements, and what you're looking for..."
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all text-sm min-h-[120px] resize-none"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#800000] hover:bg-[#600000] text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl shadow-red-900/20 flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Post Opportunity'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
