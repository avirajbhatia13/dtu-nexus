import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/Gig';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

import { auth } from '@/auth'; // NextAuth

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // @ts-ignore
        const userId = session.user.id;

        const params = await props.params;
        await dbConnect();

        const gig = await Gig.findById(params.id);
        if (!gig) return NextResponse.json({ error: 'Gig not found' }, { status: 404 });

        // Check if already applied
        const existingApp = gig.applicants.find((a: any) => a.user.toString() === userId);
        if (existingApp) {
            return NextResponse.json({ error: 'Already applied' }, { status: 400 });
        }

        const body = await req.json();
        const { message, resume, branch, semester } = body;

        // Add application
        gig.applicants.push({
            user: userId,
            status: 'pending',
            message: message || '',
            resume: resume || '',
            branch: branch || '',
            semester: semester || '',
        });

        await gig.save();
        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ error: 'Failed to apply' }, { status: 500 });
    }
}
