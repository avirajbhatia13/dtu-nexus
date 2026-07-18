'use client';

import { useState, useEffect } from 'react';
import { Send, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

export default function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
    const [content, setContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [postType, setPostType] = useState('general');
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.user) setUserRole(data.user.role || 'student');
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    type: postType,
                    isAnonymous: postType === 'general' ? isAnonymous : false, // Society posts can't be anon
                }),
            });

            if (res.ok) {
                setContent('');
                setIsAnonymous(false);
                setPostType('general');
                onPostCreated();
            }
        } catch (error) {
            console.error('Failed to post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full p-2 text-slate-700 placeholder:text-slate-400 focus:outline-none resize-none"
                    placeholder={postType === 'society' ? "Post a society update..." : "What's happening on campus?"}
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                    <div className="flex gap-2 items-center">
                        {/* Society Post Toggle */}
                        {(userRole === 'club_admin' || userRole === 'admin') && (
                            <select
                                value={postType}
                                onChange={(e) => setPostType(e.target.value)}
                                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 outline-none"
                            >
                                <option value="general">General Post</option>
                                <option value="society">Society Update</option>
                            </select>
                        )}

                        {postType === 'general' && (
                            <button
                                type="button"
                                onClick={() => setIsAnonymous(!isAnonymous)}
                                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 px-2 text-xs font-semibold ${isAnonymous ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                title="Toggle Anonymity"
                            >
                                {isAnonymous ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                {isAnonymous ? 'Anon' : 'Public'}
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!content.trim() || loading}
                        className="bg-[#800000] text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-[#600000] disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    >
                        {loading ? 'Posting...' : <>Post <Send className="h-3 w-3" /></>}
                    </button>
                </div>
            </form>
        </div>
    );
}
