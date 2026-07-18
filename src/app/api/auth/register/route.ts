import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, password, role } = body;

        // 1. Basic Validation
        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'All fields (name, email, password, role) are required' }, { status: 400 });
        }

        // 2. Security Check: DTU Email Validation
        if (!email.endsWith('@dtu.ac.in')) {
            return NextResponse.json({ error: 'DTU Email Required' }, { status: 400 });
        }

        // 3. User Existence Check
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // 4. Create User
        // Note: Password is saved as plain text per user request ("simple string comparison")
        const newUser = await User.create({
            name,
            email,
            password,
            role,
            isVerified: false
        });

        // 5. Return success
        return NextResponse.json({ message: 'User created!', userId: newUser._id }, { status: 201 });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
    }
}
