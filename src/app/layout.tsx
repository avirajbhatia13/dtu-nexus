import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'DTU Nexus',
    description: 'Unified Campus Portal for Delhi Technological University',
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-slate-50 text-slate-900 antialiased pb-20 md:pb-0">
                <div className="min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
}
