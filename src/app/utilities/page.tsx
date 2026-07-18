'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { MapPin, Search, Plus, Loader2, Phone, MessageCircle } from 'lucide-react';
import ReportItemModal from '@/components/utilities/ReportItemModal';

interface LostItem {
    _id: string;
    title: string;
    description: string;
    locationFound: string;
    type: 'lost' | 'found';
    contactPhone: string;
    contactName: string;
    status: 'open' | 'claimed';
    createdAt: string;
}

export default function UtilitiesPage() {
    const [items, setItems] = useState<LostItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'lost' | 'found'>('all');

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/lost-found', { cache: 'no-store' });
            const data = await res.json();
            if (data.items) setItems(data.items);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const filteredItems = items.filter(item => activeFilter === 'all' || item.type === activeFilter);

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <header className="bg-white sticky top-0 z-40 border-b border-slate-200 px-4 py-3 shadow-sm flex justify-between items-center">
                <h1 className="text-xl font-bold text-[#800000] flex items-center gap-2">
                    <MapPin className="h-6 w-6" /> Utilities
                </h1>
                <div className="flex bg-slate-100 rounded-full p-0.5">
                    {['all', 'lost', 'found'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f as any)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${activeFilter === f ? 'bg-white text-[#800000] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-md mx-auto p-4">
                <div className="bg-gradient-to-br from-[#800000] to-[#600000] text-white rounded-2xl p-6 mb-6 shadow-lg shadow-red-900/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-1">Lost & Found</h2>
                        <p className="text-red-100 text-sm mb-4 opacity-90">Report found items or check for lost belongings.</p>
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="bg-white text-[#800000] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 shadow-md active:scale-95 transition-transform"
                        >
                            <Plus className="h-4 w-4" /> Report Item
                        </button>
                    </div>
                    {/* Decorative Background Icon */}
                    <Search className="absolute -bottom-4 -right-4 h-32 w-32 text-white opacity-10 rotate-12" />
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Recent Items</h3>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#800000]" /></div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredItems.length === 0 && (
                            <div className="col-span-2 text-center py-12 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                No items found.
                            </div>
                        )}
                        {filteredItems.map(item => (
                            <div key={item._id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
                                <div className="h-28 bg-slate-50 flex items-center justify-center relative border-b border-slate-50">
                                    <div className={`p-4 rounded-full ${item.type === 'found' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        <MapPin className="h-8 w-8" />
                                    </div>
                                    <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm
                                        ${item.type === 'found' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                        {item.type}
                                    </div>
                                </div>
                                <div className="p-3 flex-1 flex flex-col">
                                    <h4 className="font-bold text-slate-800 text-xs line-clamp-1 mb-1">{item.title}</h4>
                                    <p className="text-[10px] text-slate-500 line-clamp-2 mb-3 flex-1 leading-relaxed">{item.description}</p>

                                    <div className="mt-auto border-t border-slate-50 pt-2 space-y-2">
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                            <MapPin className="h-3 w-3" /> <span className="truncate">{item.locationFound || 'Unknown'}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <a
                                                href={`tel:${item.contactPhone}`}
                                                className="flex items-center justify-center gap-1 bg-slate-100 text-slate-600 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-slate-200 transition-colors"
                                            >
                                                <Phone className="h-3 w-3" /> Call
                                            </a>
                                            <a
                                                href={`https://wa.me/${item.contactPhone?.replace(/\D/g, '')}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-1 bg-green-50 text-green-700 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-green-100 transition-colors border border-green-100"
                                            >
                                                <MessageCircle className="h-3 w-3" /> Chat
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Navbar />

            <ReportItemModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSuccess={fetchItems}
            />
        </div>
    );
}
