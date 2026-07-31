'use client';

import { useEffect, useState } from 'react';
import CreatePost from '@/components/feed/CreatePost';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/feed/PostCard';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Newspaper } from 'lucide-react';

export default function FeedPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'official', label: 'Official' },
        { id: 'society', label: 'Societies' },
        { id: 'marketplace', label: 'Marketplace' },
        { id: 'resolved', label: 'Resolved' },
    ];

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.user) setCurrentUserId(data.user._id);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // Logic for params based on filter
            let query = '';
            if (activeFilter === 'resolved') {
                query = '?status=resolved';
            } else if (activeFilter === 'all') {
                query = '?status=active'; // show all active
            } else {
                query = `?status=active&type=${activeFilter}`;
            }

            const res = await fetch(`/api/posts${query}`);
            const data = await res.json();
            if (data.posts) setPosts(data.posts);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [activeFilter]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white/85 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80">
                <div className="max-w-xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <img src="/dtu-logo.jpg" alt="" className="h-9 w-9 object-contain rounded-full ring-1 ring-slate-200" />
                        <div>
                            <h1 className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight">Campus Feed</h1>
                            <p className="text-[11px] text-slate-400 leading-tight">What&apos;s happening at DTU</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Filters */}
                <div className="max-w-xl mx-auto flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border
                                ${activeFilter === f.id
                                    ? 'bg-[#800000] text-white border-[#800000] shadow-sm shadow-[#800000]/20'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-xl mx-auto p-4">
                {activeFilter === 'all' && <CreatePost onPostCreated={fetchPosts} />}
                {activeFilter === 'society' && <CreatePost onPostCreated={fetchPosts} />}
                {/* Maybe allow creating society posts here? Logic implies CreatePost handles permission check */}

                {loading ? (
                    <SkeletonList count={3} />
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 px-6 animate-fade-in">
                        <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                            <Newspaper className="h-7 w-7 text-slate-400" />
                        </div>
                        <p className="text-slate-700 font-semibold mb-1">Nothing here yet</p>
                        <p className="text-slate-400 text-sm">
                            {activeFilter === 'all'
                                ? 'Be the first to share something with campus.'
                                : 'No posts in this section right now — try another filter.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 stagger">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                currentUserId={currentUserId}
                                onUpdate={fetchPosts}
                            />
                        ))}
                    </div>
                )}
            </main>

            <Navbar />
        </div>
    );
}
