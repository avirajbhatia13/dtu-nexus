import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/Gig';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const params = await props.params;
        await dbConnect();

        const gig = await Gig.findById(params.id);
        if (!gig) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (gig.poster.toString() !== user.userId && user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await Gig.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const params = await props.params;
        const body = await req.json();
        await dbConnect();

        const gig = await Gig.findById(params.id);
        if (!gig) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (gig.poster.toString() !== user.userId && user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const allowedUpdates = ['title', 'description', 'compensation', 'status', 'type'];
        for (const key of allowedUpdates) {
            if (body[key] !== undefined) gig[key] = body[key];
        }

        await gig.save();
        return NextResponse.json({ success: true, gig });
    } catch {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
