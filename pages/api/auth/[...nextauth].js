import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../lib/db";
import { User } from "../../../lib/schemas";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      // When signing in with Google, create or update the user in DB
      if (account.provider === "google") {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email.toLowerCase() });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email.toLowerCase(),
              image: user.image,
              provider: "google",
              college: "",
            });
          } else {
            existingUser.image = user.image;
            existingUser.name = user.name;
            await existingUser.save();
          }
        } catch (err) {
          console.error("DB error during signIn:", err);
          // Still allow sign-in even if DB save fails
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: (user.email || token.email).toLowerCase() });
          if (dbUser) {
            token.dbId = dbUser._id.toString();
          }
        } catch (err) {
          console.error("DB error during jwt:", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.dbId || token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);
