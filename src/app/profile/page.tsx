'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/feed/PostCard';
import { User, LogOut, Settings, Award, Loader2, Edit2 } from 'lucide-react';
import EditProfileModal from '@/components/profile/EditProfileModal';
import MyGigsList from '@/components/profile/MyGigsList';
import MyApplicationsList from '@/components/profile/MyApplicationsList';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    profilePic?: string;
    bio?: string;
    branch?: string;
    semester?: string;
    course?: string;
    age?: number;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'posts' | 'gigs'>('posts');

    const fetchUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.user) {
                setUser(data.user);
                fetchMyPosts(data.user._id);
            }
        } catch (e) { console.error(e) }
    };

    const fetchMyPosts = async (userId: string) => {
        try {
            const res = await fetch(`/api/posts?author=${userId}`);
            const data = await res.json();
            if (data.posts) setMyPosts(data.posts);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingPosts(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#800000]" /></div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-[#800000] h-32 relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg group relative">
                        <div className="h-full w-full rounded-full bg-slate-300 flex items-center justify-center text-slate-500 font-bold text-3xl overflow-hidden">
                            {user.profilePic ? <img src={user.profilePic} alt="" className="w-full h-full object-cover" /> : user.name[0]}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowEditModal(true)}
                    className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
            </div>

            <main className="max-w-md mx-auto p-4 mt-12">
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold text-slate-800">{user.name}</h1>
                    <p className="text-slate-500 text-sm capitalize mb-2">{user.role}</p>

                    {(user.branch || user.semester) && (
                        <div className="flex justify-center flex-wrap gap-2 mb-2">
                            {user.course && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{user.course}</span>}
                            {user.branch && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{user.branch}</span>}
                            {user.semester && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Sem {user.semester}</span>}
                        </div>
                    )}

                    {user.bio && <p className="text- text-slate-600 px-4">{user.bio}</p>}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-6">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'posts' ? 'border-b-2 border-[#800000] text-[#800000]' : 'text-slate-500'}`}
                    >
                        My Activity
                    </button>
                    <button
                        onClick={() => setActiveTab('gigs')}
                        className={`flex-1 pb-3 text-sm font-medium transition-colors ${activeTab === 'gigs' ? 'border-b-2 border-[#800000] text-[#800000]' : 'text-slate-500'}`}
                    >
                        My Opportunities
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Posts Tab */}
                    {activeTab === 'posts' && (
                        <div>
                            {loadingPosts ? (
                                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-[#800000]" /></div>
                            ) : (
                                <div className="space-y-4">
                                    {myPosts.length === 0 && <p className="text-slate-400 text-sm text-center">No posts yet.</p>}
                                    {myPosts.map(post => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            currentUserId={user._id}
                                            onUpdate={() => fetchMyPosts(user._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Gigs Tab */}
                    {activeTab === 'gigs' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">Posted by me</h3>
                                <MyGigsList />
                            </div>

                            <div className="pt-6 border-t border-slate-200">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">My Applications</h3>
                                <MyApplicationsList />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            // Clear legacy token just in case
                            document.cookie = 'token=; Max-Age=0; path=/;';
                            // NextAuth SignOut
                            import('next-auth/react').then(({ signOut }) => {
                                signOut({ callbackUrl: '/login' });
                            });
                        }}
                        className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center gap-3 text-red-600 mb-8"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>

                </div>
            </main>
            <Navbar />

            <EditProfileModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                user={user}
                onUpdate={fetchUser}
            />
        </div>
    );
}
