import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/lib/models/Post';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = verifyToken(token);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const params = await props.params;
        const postId = params.id;
        await dbConnect();

        const post = await Post.findById(postId);
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        const userId = user.userId;
        const hasUpvoted = post.upvotes.includes(userId);

        if (hasUpvoted) {
            post.upvotes.pull(userId);
        } else {
            post.upvotes.push(userId);
        }

        await post.save();

        return NextResponse.json({ success: true, upvotes: post.upvotes.length, hasUpvoted: !hasUpvoted });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
    }
}
