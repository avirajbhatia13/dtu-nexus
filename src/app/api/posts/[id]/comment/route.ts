import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';
import User from '@/lib/models/User'; // Registered for .populate('comments.user')
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Helper to check auth
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

        const post = await Post.findById(params.id);
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        const body = await req.json();
        if (!body.content || !body.content.trim()) {
            return NextResponse.json({ error: 'Comment content required' }, { status: 400 });
        }

        const comment = {
            user: userId,
            content: body.content,
        };

        post.comments.push(comment);
        await post.save();

        return NextResponse.json({ success: true, comment });

    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        await dbConnect();
        const post = await Post.findById(params.id)
            .populate('comments.user', 'name role profilePic');

        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ comments: post.comments });
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
