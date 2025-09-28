import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/utlis/db";
import UserModel from "@/models/userSchema";
import { TokenBlacklistService } from "./tokenBlacklist";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: "email profile" } },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,      // 1 hour
    updateAge: 15 * 60,   // refresh JWT every 15 minutes
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60,      // match session maxAge
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connect();
        try {
          const existingUser = await UserModel.findOne({ email: user.email });
          if (!existingUser) {
            await new UserModel({
              email: user.email,
              name: user.name,
              image: user.image,
              totalScore: 0,
            }).save();
          }
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      }
      return false;
    },

    async jwt({ token, user, trigger }) {
      // Generate JTI for new tokens
      if (!token.jti) {
        token.jti = TokenBlacklistService.generateJTI();
      }

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.totalScore = (user as any).totalScore || 0;
      }

      // Add issued at timestamp and expiration
      if (!token.iat) {
        token.iat = Math.floor(Date.now() / 1000);
      }
      
      // Set expiration time (1 hour from now)
      token.exp = Math.floor(Date.now() / 1000) + (60 * 60);

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string | null,
          name: token.name as string | null,
          image: token.picture as string | null,
          totalScore: token.totalScore as number,
        };
        // Add token info to session for debugging
        (session as any).tokenInfo = {
          jti: token.jti,
          exp: token.exp,
          iat: token.iat
        };
      }
      return session;
    },
  },
};