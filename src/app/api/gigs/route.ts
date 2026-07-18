import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/Gig';
import User from '@/lib/models/User';
import Post from '@/lib/models/Post';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const gigs = await Gig.find({})
            .sort({ createdAt: -1 })
            .populate('poster', 'name role department');

        return NextResponse.json({ gigs });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
    }
}

import { auth } from '@/auth'; // NextAuth

export async function POST(req: Request) {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // @ts-ignore
        const userId = session.user.id;

        await dbConnect();
        const body = await req.json();

        // Validation
        if (!body.title || !body.description) {
            return NextResponse.json({ error: 'Title and Description required' }, { status: 400 });
        }

        const newGig = await Gig.create({
            title: body.title,
            description: body.description,
            compensation: body.compensation,
            type: body.type,
            skillsRequired: body.skillsRequired || [],
            poster: userId,
        });

        await newGig.populate('poster', 'name role');

        // Auto-post to Feed
        try {
            await Post.create({
                content: `📢 **New Opportunity Alert!**\n\nI just posted a new role: **${body.title}**\n\n${body.description.substring(0, 100)}...\n\nCheck it out in the Marketplace!`,
                author: userId,
                type: 'announcement',
                isAnonymous: false,
                relatedGig: newGig._id,
            });
        } catch (postError) {
            console.error('Failed to auto-post to feed:', postError);
        }

        return NextResponse.json({ gig: newGig });

    } catch (error: any) {
        console.error('Gig creation error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create gig' }, { status: 500 });
    }
}
