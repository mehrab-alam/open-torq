import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import getUserByEmail from "@/actions/getUserByEmail";
import MailerService from "@/services/MailerService";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_PUBLIC_SECRET,
  adapter: {
    ...PrismaAdapter(prisma),
    createUser(user) {
      return prisma.user.create({
        data: {
          ...user,
          role: user.email == process.env.ADMIN_EMAIL ? "AUTHOR" : "STUDENT",
        },
      });
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isActiveUser = user.isActive ?? true;
      if (!isActiveUser) {
        return "/in-active-user";
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      const dbUser = await getUserByEmail(token?.email as string);
      if (!dbUser) {
        if (account) {
          token.accessToken = account.access_token;
          token.id = user?.id;
          token.role = "AUTHOR";
        }
        const courses = await prisma?.course.findMany({
          take: 3,
          select: {
            name: true,
            thumbnail: true,
          },
        });
        const configData = {
          name: token.name,
          productName: process.env.PLATFORM_NAME,
          url: `${process.env.NEXTAUTH_URL}/courses`,
          email: token?.email,
          studentId: token?.id,
          courses,
        };

        MailerService.sendMail("NEW_USER", configData).then((result) => {
          console.log(result.response);
        });

        return token;
      }
      return {
        ...token,
        id: dbUser.id,
        role: dbUser.role,
        phone: dbUser.phone,
        isActive: dbUser.isActive,
        user: {
          name: dbUser.name,
          email: dbUser?.email,
          image: dbUser.image,
          theme: dbUser.theme,
        },
      };
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.role = token.role;
        session.phone = token.phone as string;
        session.isActive = token.isActive;
        session.user = token.user as Object;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
export default NextAuth(authOptions);
