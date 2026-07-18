import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // NextAuth
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        await dbConnect();

        // Fetch full user details (beyond what's in the session)
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ user: null }, { status: 404 });
        }

        return NextResponse.json({ user });

    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
