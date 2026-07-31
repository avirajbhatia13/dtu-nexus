import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'DTU Nexus — Campus Portal',
    description:
        'The unified campus portal for Delhi Technological University. Feed, marketplace, lost & found, and student profiles in one place.',
    manifest: '/manifest.json',
    openGraph: {
        title: 'DTU Nexus — Campus Portal',
        description:
            'Connecting students, faculty, and societies at Delhi Technological University.',
        type: 'website',
    },
};

export const viewport: Viewport = {
    themeColor: '#800000',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className="bg-slate-50 text-slate-900 font-sans antialiased pb-20 md:pb-0">
                <div className="min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
}
