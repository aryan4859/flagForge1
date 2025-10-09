import NextAuth, { DefaultUser, DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      totalScore?: number;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    totalScore?: number;
    role?: string;
  }

  interface JWT extends DefaultJWT {
    id: string;
    totalScore?: number;
    role?: string;
    jti?: string;
    iat?: number;
    exp?: number;
  }
}