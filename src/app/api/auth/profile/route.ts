import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function PATCH(req: Request) {
    try {
        const authUser = await getAuthUser();
        if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const body = await req.json();

        // Prevent updating email/role for security if needed, or allow it. 
        // For now, allow updating profile fields.
        const allowedUpdates = ['name', 'age', 'course', 'semester', 'branch', 'bio', 'department'];
        const updateData: any = {};

        for (const key of allowedUpdates) {
            if (body[key] !== undefined) {
                updateData[key] = body[key];
            }
        }

        const user = await User.findByIdAndUpdate(
            authUser.userId,
            { $set: updateData },
            { new: true }
        );

        return NextResponse.json({ success: true, user });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
