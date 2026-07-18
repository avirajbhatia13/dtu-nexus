'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    let title = "Authentication Error";
    let message = "An unexpected error occurred during sign in.";

    if (error === 'AccessDenied') {
        title = "Restricted Access";
        message = "This software is strictly for DTU students and professors only. Your email domain is not authorized.";
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-red-100 text-center">
            <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
                {message}
            </p>

            <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.99]"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <ErrorContent />
            </Suspense>
        </div>
    );
}
