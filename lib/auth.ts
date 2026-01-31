import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@prisma/client";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireAuth();
  const allowedRoles = Array.isArray(role) ? role : [role];
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }
  
  return user;
}

export function hasRole(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return required.includes(userRole);
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === "ADMIN" || userRole === "SUPER_ADMIN";
}

export function canEditPost(userRole: UserRole, postAuthorId: string, userId: string): boolean {
  // Super Admin และ Admin แก้ไขได้ทุกบทความ
  if (isAdmin(userRole)) return true;
  
  // Editor แก้ไขได้เฉพาะบทความตัวเอง
  if (userRole === "EDITOR" && postAuthorId === userId) return true;
  
  return false;
}
