import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connect from "@/utlis/db";
import UserModel from "@/models/userSchema";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: "email profile" } },
    }),
  ],
  session: {
    strategy: "jwt",      // store session in JWT
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

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;           
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.totalScore = (user as any).totalScore || 0;
      }
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
      }
      return session;
    },
  },
};
