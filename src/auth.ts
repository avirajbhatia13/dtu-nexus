import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

// Extend NextAuth types
declare module "next-auth" {
    interface Session {
        user: {
            role?: string;
            id?: string;
        } & DefaultSession["user"]
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const dbConnect = (await import("@/lib/db")).default;
                    const User = (await import("@/lib/models/User")).default;

                    await dbConnect();

                    const user = await User.findOne({ email: credentials.email }).select('+password');

                    if (!user) return null;

                    if (!user.password || user.password !== credentials.password) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.profilePic,
                        role: user.role
                    };
                } catch (e) {
                    console.error("Auth Error:", e);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account, profile }) {
            // 1. GATEKEEPER LOGIC 🛡️
            const email = user.email?.toLowerCase();

            if (!email) return false;

            // Allow only DTU domains
            const isDTU = email.endsWith("@dtu.ac.in") || email.endsWith("@dtu.edu");

            if (!isDTU) return "/auth/error?error=AccessDenied";

            // 2. Sync Logic (Upsert User) - ONLY for OAuth
            if (account?.provider === 'google') {
                try {
                    const dbConnect = (await import("@/lib/db")).default;
                    const User = (await import("@/lib/models/User")).default;
                    await dbConnect();
                    const existingUser = await User.findOne({ email });

                    if (!existingUser) {
                        await User.create({
                            email,
                            name: user.name,
                            role: 'student',
                            image: user.image,
                            isVerified: true,
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("SignIn Sync Error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // 1. On Initial Sign In: Add data from `authorize` or `signIn` return
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
            }

            // 2. If Token Exists but missing role (e.g. Google Login first time), fetch from DB
            // This runs on SERVER (Node), so DB call is safe
            if (!token.role && token.email) {
                try {
                    const dbConnect = (await import("@/lib/db")).default;
                    const User = (await import("@/lib/models/User")).default;
                    await dbConnect();
                    const dbUser = await User.findOne({ email: token.email });
                    if (dbUser) {
                        token.id = dbUser._id.toString();
                        token.role = dbUser.role;
                    }
                } catch (e) {
                    console.error("JWT Fetch Error", e);
                }
            }

            return token;
        },
    },
})
