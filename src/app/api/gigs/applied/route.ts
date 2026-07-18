import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/Gig';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import User from '@/lib/models/User';

import { auth } from '@/auth'; // NextAuth

export async function GET(req: Request) {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // @ts-ignore
        const userId = session.user.id;

        await dbConnect();

        // queries: find gigs where applicants.user == currentUserId
        const gigs = await Gig.find({
            'applicants.user': userId
        }).populate('poster', 'name email').sort({ createdAt: -1 });

        // Map to simpler structure
        const applications = gigs.map((gig: any) => {
            const myApp = gig.applicants.find((a: any) => a.user.toString() === userId);

            // Safety check in case applicant data is corrupt
            if (!myApp) return null;

            return {
                _id: gig._id,
                title: gig.title,
                poster: {
                    name: gig.poster.name,
                    email: myApp.status === 'accepted' ? gig.poster.email : null // Only reveal email if accepted
                },
                myApplication: {
                    status: myApp.status,
                    createdAt: myApp.createdAt
                }
            };
        }).filter(Boolean); // Filter out nulls

        return NextResponse.json({ applications });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
