import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import LostItem from '@/lib/models/LostItem';
import User from '@/lib/models/User'; // Registered for .populate('finder')
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        await dbConnect();
        const items = await LostItem.find({})
            .sort({ createdAt: -1 })
            .populate('finder', 'name');
        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
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

        const { title, description, locationFound, type, contactPhone, contactName } = body;

        if (!title || !type || !contactPhone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newItem = await LostItem.create({
            title,
            description,
            locationFound,
            type, // 'lost' or 'found'
            contactPhone,
            contactName: contactName || 'Anonymous',
            finder: userId,
            status: 'open'
        });

        // Auto-post to Feed
        try {
            const Post = require('@/lib/models/Post').default;
            const emoji = type === 'lost' ? '🛑' : '✅';
            const action = type === 'lost' ? 'Lost' : 'Found';

            await Post.create({
                content: `${emoji} **${action} Item Alert!**\n\n${title}\nLocation: ${locationFound}\n\n${description.substring(0, 100)}...`,
                author: userId,
                type: 'lost_found_item',
                isAnonymous: false,
                relatedLostItem: newItem._id,
            });
        } catch (postError) {
            console.error('Failed to auto-post LostItem to feed:', postError);
        }

        return NextResponse.json({ item: newItem });
    } catch (error: any) {
        console.error('LostItem creation error:', error);
        return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
    }
}
