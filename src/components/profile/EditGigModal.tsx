'use client';

import { useState } from 'react';
import { Loader2, X, Save } from 'lucide-react';

interface Gig {
    _id: string;
    title: string;
    description: string;
    compensation: string;
    type: string;
    status: string;
}

interface EditGigModalProps {
    isOpen: boolean;
    onClose: () => void;
    gig: Gig;
    onUpdate: () => void;
}

export default function EditGigModal({ isOpen, onClose, gig, onUpdate }: EditGigModalProps) {
    const [formData, setFormData] = useState({
        title: gig.title,
        description: gig.description, // Note: fetchMyPosts only returns list fields, check if description is available. 
        // Actually MyGigsList fetches minimal data? No, it uses /api/gigs/my which returns fields.
        // We might need to ensure description is there.
        compensation: gig.compensation,
        status: gig.status,
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/gigs/${gig._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                onUpdate();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200 m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#800000]">Edit Opportunity</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded-lg text-sm"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                        <select
                            className="w-full border p-2 rounded-lg text-sm bg-white"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Compensation</label>
                        <select
                            className="w-full border p-2 rounded-lg text-sm"
                            value={formData.compensation}
                            onChange={e => setFormData({ ...formData, compensation: e.target.value })}
                        >
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                            <option value="Credit Based">Credit Based</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                        <textarea
                            className="w-full border p-2 rounded-lg text-sm h-32 resize-none"
                            value={formData.description} // Make sure this is populated
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#800000] text-white p-3 rounded-lg font-semibold hover:bg-[#600000] flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="h-4 w-4" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
