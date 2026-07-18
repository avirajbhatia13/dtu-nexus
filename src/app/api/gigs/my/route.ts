import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/Gig';
import { auth } from '@/auth'; // NextAuth

export async function GET() {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // @ts-ignore
        const userId = session.user.id;

        await dbConnect();

        // Find gigs posted by this user
        const gigs = await Gig.find({ poster: userId })
            .sort({ createdAt: -1 })
            .populate('applicants.user', 'name email branch semester'); // Populate applicant details

        return NextResponse.json({ gigs });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
