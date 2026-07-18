import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

import { auth } from '@/auth'; // NextAuth

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // @ts-ignore
        const userId = session.user.id;
        // @ts-ignore
        const userRole = session.user.role;

        const params = await props.params;
        await dbConnect();

        const post = await Post.findById(params.id);
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        // Check ownership (or admin for moderation)
        if (post.author.toString() !== userId && userRole !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await Post.deleteOne({ _id: params.id });
        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
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

        // Ownership check
        if (post.author.toString() !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();

        // Handle Content Update
        if (body.content) {
            post.content = body.content;
            post.isEdited = true;
        }

        // Handle Grievance Status Update
        if (body.grievanceStatus) {
            // Only allow if it's a grievance
            if (post.type === 'grievance') {
                post.grievanceStatus = body.grievanceStatus;
            }
        }

        await post.save();
        return NextResponse.json({ post });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
