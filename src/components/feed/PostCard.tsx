'use client';

import { useState } from 'react';
import { MessageCircle, MessageSquare, ThumbsUp, ShieldAlert, CheckCircle2, MoreVertical, Trash2, Edit2, X, Check, MapPin, Phone, User, ExternalLink, Briefcase, Zap, Clock, Send, GraduationCap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CommentModal from './CommentModal';

interface Post {
    _id: string;
    content: string;
    author: {
        _id: string;
        name: string;
        role: string;
        email?: string;
    };
    type: string;
    isAnonymous: boolean;
    isEdited?: boolean;
    createdAt: string;
    grievanceStatus?: string;
    upvotes: string[];
    comments?: any[];
    relatedGig?: {
        _id: string;
        title: string;
        compensation: string;
        type: string;
        skillsRequired: string[];
        applicants: any[];
        status: string;
    };
    relatedLostItem?: {
        title: string;
        description: string;
        locationFound: string;
        type: 'lost' | 'found';
        contactPhone: string;
        contactName: string;
        status: string;
    };
}

interface PostCardProps {
    post: Post;
    currentUserId?: string;
    onUpdate: () => void;
}

export default function PostCard({ post, currentUserId, onUpdate }: PostCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [showMenu, setShowMenu] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const isAuthor = currentUserId === post.author?._id;
    const isGig = !!post.relatedGig;
    const isLostItem = !!post.relatedLostItem;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        setLoading(true);
        try {
            await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
            onUpdate();
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent })
            });
            if (res.ok) { setIsEditing(false); onUpdate(); }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleResolve = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${post._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ grievanceStatus: 'resolved' })
            });
            if (res.ok) onUpdate();
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleApply = () => {
        // In a real app, this would open the Apply Modal directly passing the gig ID
        window.location.href = '/profile'; // Navigate for demo
    };

    // --- RENDER HELPERS ---

    const renderHeader = () => (
        <div className="flex gap-3 mb-3">
            <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-white shadow-md text-lg
                ${post.isAnonymous ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 'bg-gradient-to-br from-[#800000] to-[#a00000]'}`}>
                {post.isAnonymous ? '?' : (post.author?.name ? post.author.name[0] : 'U')}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 text-sm">
                                {post.isAnonymous ? 'Anonymous Student' : (post.author?.name || 'Unknown User')}
                            </p>
                            {!post.isAnonymous && <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-50 rounded-full border border-slate-100">{post.author?.role || 'Student'}</span>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            {formatDistanceToNow(new Date(post.createdAt))} ago
                            {post.isEdited && <span className="italic">(edited)</span>}
                            • {post.type.replace('_', ' ').toUpperCase()}
                        </p>
                    </div>

                    {/* Options Menu */}
                    {isAuthor && !isEditing && (
                        <div className="relative">
                            <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                                <MoreVertical className="h-4 w-4" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 w-32 z-10 overflow-hidden ring-1 ring-black/5">
                                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700">
                                        <Edit2 className="h-3 w-3" /> Edit
                                    </button>
                                    <button onClick={handleDelete} className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-red-50 text-red-600">
                                        <Trash2 className="h-3 w-3" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderGigCard = () => {
        if (!post.relatedGig) return null;
        const gig = post.relatedGig;
        return (
            <div className="mt-3 bg-gradient-to-br from-violet-50 via-white to-white border border-violet-100 rounded-xl p-4 shadow-sm relative overflow-hidden group/card hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/card:scale-110 transition-transform">
                    <Briefcase className="h-24 w-24 text-violet-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-violet-200 shadow-sm">
                            {gig.type.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                            <User className="h-3 w-3" /> {gig.applicants?.length || 0} Applied
                        </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{gig.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <Zap className="h-3 w-3" /> {gig.compensation}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {gig.skillsRequired.map((skill: string) => (
                            <span key={skill} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-md shadow-sm">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <button
                        onClick={handleApply}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.99]"
                    >
                        View Details & Apply <ExternalLink className="h-3 w-3" />
                    </button>
                </div>
            </div>
        );
    };

    const renderLostFoundCard = () => {
        if (!post.relatedLostItem) return null;
        const item = post.relatedLostItem;
        const isLost = item.type === 'lost';
        const themeColor = isLost ? 'red' : 'emerald';
        const bgColor = isLost ? 'bg-red-50' : 'bg-emerald-50';
        const borderColor = isLost ? 'border-red-100' : 'border-emerald-100';
        const iconColor = isLost ? 'text-red-500' : 'text-emerald-500';

        return (
            <div className={`mt-3 ${bgColor} border ${borderColor} rounded-xl p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
                <div className="p-4 relative">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm bg-white ${isLost ? 'text-red-700' : 'text-emerald-700'}`}>
                            {isLost ? <ShieldAlert className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                            {isLost ? 'Lost Item' : 'Found Item'}
                        </span>

                        <span className="text-[10px] font-medium text-slate-500 bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Active
                        </span>
                    </div>

                    <h3 className={`font-bold text-lg mb-1 leading-tight ${isLost ? 'text-red-900' : 'text-emerald-900'}`}>
                        {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4 bg-white/50 p-2 rounded-lg backdrop-blur-sm inline-flex">
                        <MapPin className={`h-3.5 w-3.5 ${iconColor}`} />
                        <span className="font-medium">{item.locationFound}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-white/40 p-3 rounded-xl border border-white/50">
                        {item.description}
                    </p>

                    {/* Interactive Contact Section */}
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100/50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 ml-1">Contact {item.contactName}</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a href={`tel:${item.contactPhone}`}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98]
                                ${isLost ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'} shadow-lg`}
                            >
                                <Phone className="h-3.5 w-3.5" /> Call Now
                            </a>
                            <a href={`https://wa.me/${item.contactPhone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98]"
                            >
                                <MessageCircle className="h-3.5 w-3.5 text-green-600" /> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/50 relative group mb-4 hover:border-slate-200 transition-colors">
            {renderHeader()}

            {/* Editing Mode */}
            {isEditing ? (
                <div className="mb-3 bg-slate-50 p-3 rounded-xl">
                    <textarea
                        className="w-full bg-transparent border-0 p-0 text-sm focus:ring-0 resize-none mb-2"
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        rows={3}
                    />
                    <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg">Cancel</button>
                        <button onClick={handleSaveEdit} className="px-3 py-1.5 text-xs font-bold bg-[#800000] text-white rounded-lg hover:bg-[#600000]">Save Changes</button>
                    </div>
                </div>
            ) : (
                <div className="mb-2">
                    {/* Main Content only if plain post (not gig/lost item which have their own cards) */}
                    {/* OR show context text for those too if it adds value. Let's show content if it exists and isn't auto-generated placeholder */}
                    <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap pl-1">
                        {/* We hide the content if it's the auto-generated boilerplate for deep cards to avoid redundancy, 
                            OR we style it differently. Let's keep it simple: Show content. */}
                        {!isGig && !isLostItem && post.content}
                        {(isGig || isLostItem) && <p className="text-slate-500 text-xs italic mb-2">shared a new update:</p>}
                    </div>

                    {renderGigCard()}
                    {renderLostFoundCard()}
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-50">
                <div className="flex gap-4">
                    <VoteButton postId={post._id} initialCount={post.upvotes.length} initialHasVoted={post.upvotes.includes(currentUserId || '')} />
                    <button
                        onClick={() => setShowCommentModal(true)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors group/btn"
                    >
                        <div className="p-1.5 rounded-full group-hover/btn:bg-blue-50 transition-colors">
                            <MessageSquare className="h-4 w-4" />
                        </div>
                        {post.comments?.length ? post.comments.length : 'Comment'}
                    </button>
                </div>

                {isAuthor && post.grievanceStatus !== 'resolved' && (
                    <button onClick={handleResolve} disabled={loading} className="text-[10px] border border-green-200 bg-green-50 text-green-700 px-2.5 py-1 rounded-lg font-bold hover:bg-green-100 transition-colors flex items-center gap-1">
                        <Check className="h-3 w-3" /> Mark Resolved
                    </button>
                )}
            </div>

            {/* Click outside to close menu */}
            {showMenu && <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />}

            <CommentModal isOpen={showCommentModal} onClose={() => setShowCommentModal(false)} postId={post._id} />
        </div>
    );
}

function VoteButton({ postId, initialCount, initialHasVoted }: { postId: string, initialCount: number, initialHasVoted: boolean }) {
    const [count, setCount] = useState(initialCount);
    const [hasVoted, setHasVoted] = useState(initialHasVoted);
    const [loading, setLoading] = useState(false);

    const handleVote = async () => {
        if (loading) return;
        setLoading(true);
        const newHasVoted = !hasVoted;
        setHasVoted(newHasVoted);
        setCount(c => newHasVoted ? c + 1 : c - 1);

        try {
            const res = await fetch(`/api/posts/${postId}/vote`, { method: 'POST' });
            if (!res.ok) throw new Error();
        } catch {
            setHasVoted(!newHasVoted);
            setCount(c => !newHasVoted ? c + 1 : c - 1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleVote}
            className={`flex items-center gap-1 text-xs font-bold transition-colors group/vote ${hasVoted ? 'text-[#800000]' : 'text-slate-400 hover:text-[#800000]'}`}
        >
            <div className={`p-1.5 rounded-full transition-colors ${hasVoted ? 'bg-red-50' : 'group-hover/vote:bg-slate-50'}`}>
                <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} />
            </div>
            {count}
        </button>
    );
}
