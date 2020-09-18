import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, {
    providers: [
        Providers.Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log(credentials);
                const user = null;
                return Promise.resolve(user || null);
            }
        })
    ],
    database: process.env.DATABASE_URL,
    secret: process.env.AUTH_SECRET,
    session: {
        jwt: true,
        maxAge: 4e10,
    },
    jwt: {
        secret: process.env.ACCESS_TOKEN,
        encryption: true,
    } as any,
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: null // If set, new users will be directed here on first sign in
      }
});