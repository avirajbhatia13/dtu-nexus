'use client';

import { useState } from 'react';
import { X, MapPin, Phone, User, Loader2, AlertCircle } from 'lucide-react';

interface ReportItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReportItemModal({ isOpen, onClose, onSuccess }: ReportItemModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactName, setContactName] = useState('');
    const [type, setType] = useState('lost');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/lost-found', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    locationFound: location,
                    type,
                    contactPhone,
                    contactName
                }),
            });

            if (res.ok) {
                // Reset form
                setTitle('');
                setDescription('');
                setLocation('');
                setContactPhone('');
                setContactName('');
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-[#800000]" />
                        Report Item
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Type Toggle */}
                    <div className="bg-slate-100 p-1 rounded-xl flex">
                        <button
                            type="button"
                            onClick={() => setType('lost')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${type === 'lost' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
                        >
                            I LOST SOMETHING
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('found')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${type === 'found' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-600'}`}
                        >
                            I FOUND SOMETHING
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">What is it?</label>
                        <input
                            type="text"
                            placeholder="e.g. Blue Water Bottle / ID Card"
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none text-sm font-medium"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                        <textarea
                            placeholder="Color, brand, distinct features..."
                            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none text-sm resize-none h-20"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={type === 'lost' ? "Last seen at..." : "Found at..."}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none text-sm"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none text-sm"
                                    value={contactName}
                                    onChange={e => setContactName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="tel"
                                placeholder="+91 98765..."
                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#800000]/20 outline-none text-sm font-medium tracking-wide"
                                value={contactPhone}
                                onChange={e => setContactPhone(e.target.value)}
                                required
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 ml-1">This will be shared so people can contact you.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#800000] hover:bg-[#600000] text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl shadow-red-900/20 flex justify-center items-center gap-2 mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Report Item'}
                    </button>
                </form>
            </div>
        </div>
    );
}
