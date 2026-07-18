import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // 1. Find user (select password explicitly since select:false)
        const user = await User.findOne({ email }).select('+password');

        console.log(`[Login Attempt] Email: ${email}, Found: ${!!user}`);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Check Password
        // Simple string comparison as requested
        console.log(`[Login Debug] Stored Pass Length: ${user.password?.length}, Input Pass Length: ${password?.length}`);
        console.log(`[Login Debug] Match: ${user.password === password}`);

        if (user.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Generate Token (Legacy support for Middleware)
        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        const response = NextResponse.json({
            message: 'Login Success',
            name: user.name,
            role: user.role,
            token // Returning token for client use if needed
        });

        // Set cookie for session management
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
