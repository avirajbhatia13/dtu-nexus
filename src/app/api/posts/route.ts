import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User'; // Ensure User model is registered
import Gig from '@/lib/models/Gig'; // Registered for .populate('relatedGig')
import LostItem from '@/lib/models/LostItem'; // Registered for .populate('relatedLostItem')
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const authorId = searchParams.get('author');
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        await dbConnect();

        let query: any = {};
        if (authorId) {
            query.author = authorId;
        }

        if (status === 'resolved') {
            query.grievanceStatus = 'resolved';
        } else if (status === 'active') {
            // Show everything EXCEPT resolved grievances
            query.grievanceStatus = { $ne: 'resolved' };
        }

        if (type && type !== 'all') {
            // Special case: Marketplace posts are 'announcement'
            if (type === 'marketplace') {
                query.type = 'announcement';
            } else {
                query.type = type;
            }
        }

        // Populate author (name, role, etc) to display in feed
        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'name role email profilePic')
            .populate('relatedGig', 'title compensation type skillsRequired applicants status')
            .populate('relatedLostItem', 'title description locationFound type contactPhone contactName status')
            .limit(50); // Pagination needed later

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
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
        // @ts-ignore
        const userRole: string = session.user.role || '';

        await dbConnect();
        const body = await req.json();

        // Validation
        if (!body.content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Role check for 'official' posts
        if (body.type === 'official' && !['club_admin', 'admin', 'professor'].includes(userRole)) {
            return NextResponse.json({ error: 'Only admins/profs can post Official announcements' }, { status: 403 });
        }

        // Role check for 'society' posts
        if (body.type === 'society' && !['club_admin', 'admin'].includes(userRole)) {
            return NextResponse.json({ error: 'Only club admins can post Society updates' }, { status: 403 });
        }

        const newPost = await Post.create({
            ...body,
            author: userId,
        });

        // Return populated post
        await newPost.populate('author', 'name role');

        return NextResponse.json({ post: newPost });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
