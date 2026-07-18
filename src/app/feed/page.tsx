'use client';

import { useEffect, useState } from 'react';
import CreatePost from '@/components/feed/CreatePost';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/feed/PostCard';
import { Loader2 } from 'lucide-react';

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
            <header className="bg-white sticky top-0 z-40 border-b border-slate-200 shadow-sm">
                <div className="px-4 py-3 flex justify-between items-center mb-1">
                    <h1 className="text-xl font-bold text-[#800000]">Campus Feed</h1>
                    <div className="flex items-center gap-3">
                        {/* @ts-ignore */}
                        <img src="/dtu-logo.jpg" alt="DTU" className="h-10 w-10 object-contain mix-blend-multiply" />
                        <div className={`h-8 w-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold ${currentUserId ? 'bg-[#800000]' : 'bg-slate-300'}`}>
                            {/* Placeholder */}
                        </div>
                    </div>
                </div>

                {/* Scrollable Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border
                                ${activeFilter === f.id
                                    ? 'bg-[#800000] text-white border-[#800000] shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-md mx-auto p-4">
                {activeFilter === 'all' && <CreatePost onPostCreated={fetchPosts} />}
                {activeFilter === 'society' && <CreatePost onPostCreated={fetchPosts} />}
                {/* Maybe allow creating society posts here? Logic implies CreatePost handles permission check */}

                {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#800000]" /></div>
                ) : (
                    <div className="space-y-4">
                        {posts.length === 0 && (
                            <div className="text-center py-10 text-slate-400 text-sm">
                                No posts found in this section.
                            </div>
                        )}
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
