import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Gig from '@/lib/models/Gig';
import { auth } from '@/auth'; // NextAuth

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
        const gigId = params.id;
        const { applicantId, status } = await req.json();

        if (!['accepted', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        await dbConnect();
        const gig = await Gig.findById(gigId);

        if (!gig) return NextResponse.json({ error: 'Gig not found' }, { status: 404 });

        // Verify ownership
        if (gig.poster.toString() !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Find and update applicant
        const applicant = gig.applicants.find((a: any) => a.user.toString() === applicantId);
        if (!applicant) {
            return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
        }

        applicant.status = status;
        await gig.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update applicant' }, { status: 500 });
    }
}
