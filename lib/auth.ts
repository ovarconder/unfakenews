import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  EDITOR = "EDITOR",
  AUTHOR = "AUTHOR",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Mock users for development
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@unfakenews.com",
    name: "Super Admin",
    role: UserRole.SUPER_ADMIN,
  },
  {
    id: "2",
    email: "editor@unfakenews.com",
    name: "Editor",
    role: UserRole.EDITOR,
  },
  {
    id: "3",
    email: "author@unfakenews.com",
    name: "Author",
    role: UserRole.AUTHOR,
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Mock authentication - in production, verify against database
        const user = mockUsers.find((u) => u.email === credentials.email);

        if (user && credentials.password === "password123") {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
};
