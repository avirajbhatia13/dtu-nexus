'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, MapPin, User } from 'lucide-react';
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/80 py-1.5 px-6 safe-area-bottom z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={clsx(
                                'relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all',
                                isActive
                                    ? 'text-[#800000]'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            )}
                        >
                            {/* Active indicator */}
                            <span
                                className={clsx(
                                    'absolute -top-1.5 h-1 w-1 rounded-full bg-[#800000] transition-opacity',
                                    isActive ? 'opacity-100' : 'opacity-0'
                                )}
                            />
                            <item.icon
                                className="h-[22px] w-[22px]"
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span
                                className={clsx(
                                    'text-[10px]',
                                    isActive ? 'font-bold' : 'font-medium'
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
