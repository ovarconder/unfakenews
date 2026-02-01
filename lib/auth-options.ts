import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials (Email/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          throw new Error("Email and password required");
        }

        console.log('🔍 Attempting login:', credentials.email);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.log('❌ User not found:', credentials.email);
          throw new Error("Invalid credentials");
        }

        console.log('✅ User found:', user.email, 'Role:', user.role);

        if (!user.password) {
          console.log('❌ User has no password');
          throw new Error("Invalid credentials");
        }

        console.log('🔐 Password hash exists, length:', user.password.length);
        console.log('🔐 Hash preview:', user.password.substring(0, 20) + '...');

        // ใช้ bcrypt เพื่อเปรียบเทียบ password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        console.log('🔐 bcrypt.compare() result:', isValid);

        if (!isValid) {
          console.log('❌ Password mismatch');
          throw new Error("Invalid credentials");
        }

        console.log('✅ Authentication successful!');

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.id as string;
      }
      return session;
    },
    
    async signIn({ user, account, profile }) {
      // Allow sign in
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    // signOut: "/auth/signout", // optional
    // verifyRequest: "/auth/verify", // optional
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  // Trust host headers from Vercel
  useSecureCookies: process.env.NODE_ENV === "production",
  
  debug: process.env.NODE_ENV === "development",
};
