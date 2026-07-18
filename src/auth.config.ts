import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        error: '/auth/error',
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isPublicPath = nextUrl.pathname === '/login' ||
                nextUrl.pathname === '/register' ||
                nextUrl.pathname.startsWith('/api') ||
                nextUrl.pathname.startsWith('/_next') ||
                nextUrl.pathname === '/auth/error';

            if (isPublicPath) {
                return true;
            }

            if (!isLoggedIn) {
                return false; // Redirect to login
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                // @ts-ignore
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    providers: [], // Providers added in auth.ts
} satisfies NextAuthConfig;
