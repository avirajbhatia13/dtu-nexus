'use client';

import { Home, Newspaper, Briefcase, User, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', icon: Home, href: '/home' }, // Assuming we might make a home dashboard, or just link to feed? Reference says Home. Let's make it /feed first or /home if we build it. Plan said Feed is main. Let's use /feed as Home or placeholder. Reference had "Home", "Feed", "Marketplace", "Profile".
        // Current app structure: /feed is the main landing after login.
        // Let's map Home -> /feed (for now) or /dashboard.
        // Actually, the reference had Home separate from Feed.
        // For this MVP, let's just use:
        // Feed -> /feed
        // Marketplace -> /marketplace
        // Profile -> /profile
        // Utilities -> /utilities (replacing Home? or distinct?)
        // Let's stick to the current functional areas + Utilities.
        { name: 'Feed', icon: Newspaper, href: '/feed' },
        { name: 'Marketplace', icon: Briefcase, href: '/marketplace' },
        { name: 'Utilities', icon: Search, href: '/utilities' }, // Using Search icon for Lost & Found/Utils
        { name: 'Profile', icon: User, href: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-6 flex justify-between items-center z-50 pb-safe">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'text-[#800000]' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <item.icon className={`h-6 w-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}
