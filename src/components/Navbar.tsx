'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, MapPin, User, PlusCircle } from 'lucide-react';
import { clsx } from 'clsx';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/feed', icon: Home, label: 'Feed' },
        { href: '/marketplace', icon: Briefcase, label: 'Market' },
        { href: '/utilities', icon: MapPin, label: 'Utilities' },
        { href: '/profile', icon: User, label: 'Profile' },
    ];

    if (pathname === '/login') return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-6 safe-area-bottom z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center gap-1 transition-colors",
                                isActive ? "text-[#800000]" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <item.icon className={clsx("h-6 w-6", isActive && "fill-current/10")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
