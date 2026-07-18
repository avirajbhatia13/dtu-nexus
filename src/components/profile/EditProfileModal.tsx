'use client';

import { useState } from 'react';
import { Loader2, X, Save } from 'lucide-react';

interface UserProfile {
    name: string;
    branch?: string;
    course?: string;
    semester?: string;
    age?: number;
    bio?: string;
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onUpdate: () => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
    const [formData, setFormData] = useState({
        name: user.name || '',
        branch: user.branch || '',
        course: user.course || '',
        semester: user.semester || '',
        age: user.age || '',
        bio: user.bio || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/profile', {
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
                    <h3 className="text-xl font-bold text-[#800000]">Edit Profile</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded-lg text-sm"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Age</label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded-lg text-sm"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Semester</label>
                            <select
                                className="w-full border p-2 rounded-lg text-sm bg-white"
                                value={formData.semester}
                                onChange={e => setFormData({ ...formData, semester: e.target.value })}
                            >
                                <option value="">Select</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Course</label>
                            <select
                                className="w-full border p-2 rounded-lg text-sm bg-white"
                                value={formData.course}
                                onChange={e => setFormData({ ...formData, course: e.target.value })}
                            >
                                <option value="">Select</option>
                                <option value="B.Tech">B.Tech</option>
                                <option value="M.Tech">M.Tech</option>
                                <option value="MBA">MBA</option>
                                <option value="Design">Design</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Branch</label>
                            <input
                                type="text"
                                placeholder="e.g. CSE, ME"
                                className="w-full border p-2 rounded-lg text-sm"
                                value={formData.branch}
                                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Bio</label>
                        <textarea
                            className="w-full border p-2 rounded-lg text-sm h-20 resize-none"
                            placeholder="Tell us about yourself..."
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
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
