import { useEffect, useState } from 'react';
import { Loader2, Briefcase, Users, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import EditGigModal from './EditGigModal';

interface Applicant {
    user: {
        _id: string;
        name: string;
        email: string;
        branch?: string;
        semester?: string;
    };
    status: string;
    message?: string;
}

interface Gig {
    _id: string;
    title: string;
    description: string;
    status: string;
    applicants: Applicant[];
    compensation: string;
    type: string;
}

export default function MyGigsList() {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingGig, setEditingGig] = useState<Gig | null>(null);

    const fetchGigs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/gigs/my');
            const data = await res.json();
            if (data.gigs) setGigs(data.gigs);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this opportunity?')) return;
        try {
            const res = await fetch(`/api/gigs/${id}`, { method: 'DELETE' });
            if (res.ok) fetchGigs();
        } catch (e) { console.error(e); }
    };

    const handleClose = async (id: string) => {
        try {
            const res = await fetch(`/api/gigs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'closed' })
            });
            if (res.ok) fetchGigs();
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchGigs();
    }, []);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#800000]" /></div>;
    if (gigs.length === 0) return <div className="text-center p-8 text-slate-400">You haven't posted any opportunities yet.</div>;

    return (
        <div className="space-y-4">
            {gigs.map(gig => (
                <div key={gig._id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-slate-800">{gig.title}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${gig.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {gig.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setEditingGig(gig)}
                                className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                                title="Edit"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            {gig.status === 'open' && (
                                <button
                                    onClick={() => handleClose(gig._id)}
                                    className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                                    title="Close Opportunity"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(gig._id)}
                                className="p-1.5 hover:bg-red-50 rounded text-red-500"
                                title="Delete"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 mt-3">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-600">
                                Applicants ({gig.applicants.length})
                            </span>
                        </div>

                        {gig.applicants.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No applications yet.</p>
                        ) : (
                            <div className="space-y-2 mt-2">
                                {gig.applicants.map((app, idx) => (
                                    <div key={idx} className="bg-white p-2 rounded border border-slate-100 flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{app.user.name}</p>
                                            <p className="text-[10px] text-slate-500">
                                                {app.user.branch || 'Unknown Branch'} • Sem {app.user.semester || '?'}
                                            </p>
                                            {app.user.email && <p className="text-[10px] text-slate-400">{app.user.email}</p>}
                                            {app.message && (
                                                <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded mt-1 border border-slate-100 max-w-xs">
                                                    "{app.message}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize mb-1 ${app.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                                                    app.status === 'accepted' ? 'bg-green-50 text-green-600' :
                                                        'bg-red-50 text-red-600'
                                                }`}>
                                                {app.status}
                                            </span>

                                            {app.status === 'pending' && (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await fetch(`/api/gigs/${gig._id}/applicants`, {
                                                                    method: 'PATCH',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ applicantId: app.user._id, status: 'rejected' })
                                                                });
                                                                fetchGigs();
                                                            } catch (e) { console.error(e); }
                                                        }}
                                                        className="p-1 bg-red-50 hover:bg-red-100 text-red-600 rounded"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await fetch(`/api/gigs/${gig._id}/applicants`, {
                                                                    method: 'PATCH',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ applicantId: app.user._id, status: 'accepted' })
                                                                });
                                                                fetchGigs();
                                                            } catch (e) { console.error(e); }
                                                        }}
                                                        className="p-1 bg-green-50 hover:bg-green-100 text-green-600 rounded"
                                                        title="Accept"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {editingGig && (
                <EditGigModal
                    isOpen={true}
                    onClose={() => setEditingGig(null)}
                    gig={editingGig}
                    onUpdate={fetchGigs}
                />
            )}
        </div>
    );
}
