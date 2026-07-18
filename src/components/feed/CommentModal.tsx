'use client';

import { useState, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
    _id: string;
    content: string;
    createdAt: string;
    user: {
        _id: string;
        name: string;
        role: string;
    };
}

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: string;
}

export default function CommentModal({ isOpen, onClose, postId }: CommentModalProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${postId}/comment`);
            const data = await res.json();
            if (data.comments) setComments(data.comments);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                setNewComment('');
                fetchComments(); // Refresh list
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [isOpen, postId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md h-[80vh] sm:h-[600px] sm:rounded-xl rounded-t-2xl flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Comments</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#800000]" /></div>
                    ) : comments.length === 0 ? (
                        <div className="text-center text-slate-400 py-10 text-sm">No comments yet. Be the first!</div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0">
                                    {comment.user.name[0]}
                                </div>
                                <div>
                                    <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none">
                                        <p className="text-xs font-bold text-slate-800">{comment.user.name}</p>
                                        <p className="text-sm text-slate-700 mt-0.5">{comment.content}</p>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 pl-2">
                                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 flex gap-2 items-end bg-white sm:rounded-b-xl">
                    <textarea
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#800000] resize-none max-h-32"
                        rows={1}
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                        className="bg-[#800000] text-white p-2 rounded-full hover:bg-[#600000] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
