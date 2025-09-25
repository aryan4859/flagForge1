import NextAuth, { DefaultUser, DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            totalScore?: number;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
        totalScore?: number;
    }

    interface JWT extends DefaultJWT {
        id: string;
        totalScore?: number;
        jti?: string; 
        iat?: number;
    }
}
