'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, Clock, XCircle, Mail, Phone } from 'lucide-react';

interface AppliedGig {
    _id: string;
    title: string;
    poster: {
        name: string;
        email: string;
    };
    myApplication: {
        status: string;
        createdAt: string;
    };
}

export default function MyApplicationsList() {
    const [applications, setApplications] = useState<AppliedGig[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/gigs/applied')
            .then(res => res.json())
            .then(data => {
                if (data.applications) setApplications(data.applications);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#800000]" /></div>;
    if (applications.length === 0) return <div className="text-center p-8 text-slate-400">You haven't applied to any opportunities yet.</div>;

    return (
        <div className="space-y-4">
            {applications.map(app => (
                <div key={app._id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">{app.title}</h3>
                            <p className="text-xs text-slate-500">Posted by {app.poster.name}</p>
                        </div>
                        <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1
                            ${app.myApplication.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                app.myApplication.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'}`}>
                            {app.myApplication.status === 'accepted' && <CheckCircle className="h-3 w-3" />}
                            {app.myApplication.status === 'pending' && <Clock className="h-3 w-3" />}
                            {app.myApplication.status === 'rejected' && <XCircle className="h-3 w-3" />}
                            {app.myApplication.status}
                        </div>
                    </div>

                    {app.myApplication.status === 'accepted' && (
                        <div className="mt-3 bg-green-50 border border-green-100 rounded-lg p-3">
                            <p className="text-xs font-bold text-green-800 mb-1">Congratulations! You've been accepted.</p>
                            <p className="text-xs text-green-700 mb-2">Please contact the poster to proceed:</p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2 rounded border border-green-100">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                {app.poster.email}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
