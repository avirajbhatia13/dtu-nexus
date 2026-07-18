import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // NextAuth
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

const VALID_ROLES = ['student', 'professor', 'club_admin', 'admin'];

/**
 * Confirms the current session belongs to an admin, verified against the DB
 * (not just the JWT). Returns the admin user doc, or null if not authorized.
 */
async function requireAdmin() {
    const session = await auth();
    if (!session || !session.user?.email) return null;

    await dbConnect();
    const me = await User.findOne({ email: session.user.email });
    if (!me || me.role !== 'admin') return null;
    return me;
}

// GET /api/admin/users — list every user (admin only)
export async function GET() {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await User.find({})
        .select('name email role department createdAt')
        .sort({ createdAt: 1 });

    return NextResponse.json({ users });
}

// PATCH /api/admin/users — assign a role to a user (admin only)
// Body: { userId: string, role: string }
export async function PATCH(req: Request) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId || !role) {
        return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }
    if (!VALID_ROLES.includes(role)) {
        return NextResponse.json({ error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` }, { status: 400 });
    }

    // Safety: an admin cannot demote themselves (avoids locking out the last admin).
    if (userId === admin._id.toString() && role !== 'admin') {
        return NextResponse.json({ error: 'You cannot change your own admin role.' }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
    ).select('name email role department');

    if (!updated) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updated });
}
