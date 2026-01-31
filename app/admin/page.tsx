"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, ShieldCheck, User, Mail } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลด...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      SUPER_ADMIN: { label: "Super Admin", color: "bg-red-500" },
      ADMIN: { label: "Admin", color: "bg-orange-500" },
      EDITOR: { label: "Editor", color: "bg-blue-500" },
      USER: { label: "User", color: "bg-gray-500" },
    };
    return badges[role as keyof typeof badges] || badges.USER;
  };

  const badge = getRoleBadge(session.user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              ยินดีต้อนรับ, {session.user.name || session.user.email}!
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            ออกจากระบบ
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {(session.user.name || session.user.email || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {session.user.name || "Anonymous"}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${badge.color}`}
                >
                  <ShieldCheck className="inline h-3 w-3 mr-1" />
                  {badge.label}
                </span>
              </div>
              <div className="space-y-1 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {session.user.email}
                </p>
                <p className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User ID: {session.user.id}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Role Permissions */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">สิทธิ์การใช้งาน</h3>
          <div className="space-y-2">
            {session.user.role === "SUPER_ADMIN" && (
              <>
                <PermissionItem icon="✅" text="จัดการผู้ใช้และ Role" />
                <PermissionItem icon="✅" text="สร้าง/แก้ไข/ลบบทความทั้งหมด" />
                <PermissionItem icon="✅" text="จัดการระบบทั้งหมด" />
              </>
            )}
            {session.user.role === "ADMIN" && (
              <>
                <PermissionItem icon="✅" text="สร้าง/แก้ไข/ลบบทความทั้งหมด" />
                <PermissionItem icon="✅" text="จัดการหมวดหมู่และแท็ก" />
                <PermissionItem icon="❌" text="จัดการผู้ใช้ (เฉพาะ Super Admin)" />
              </>
            )}
            {session.user.role === "EDITOR" && (
              <>
                <PermissionItem icon="✅" text="สร้างบทความใหม่" />
                <PermissionItem icon="✅" text="แก้ไขบทความของตัวเอง" />
                <PermissionItem icon="❌" text="แก้ไขบทความของผู้อื่น" />
              </>
            )}
            {session.user.role === "USER" && (
              <>
                <PermissionItem icon="✅" text="อ่านบทความ" />
                <PermissionItem icon="❌" text="สร้าง/แก้ไขบทความ" />
              </>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          {(session.user.role === "ADMIN" ||
            session.user.role === "SUPER_ADMIN" ||
            session.user.role === "EDITOR") && (
            <Card
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/admin/posts/create")}
            >
              <h3 className="font-bold mb-2">สร้างบทความใหม่</h3>
              <p className="text-sm text-muted-foreground">
                เขียนบทความใหม่และแปลเป็น 10 ภาษาอัตโนมัติ
              </p>
            </Card>
          )}

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/posts")}
          >
            <h3 className="font-bold mb-2">จัดการบทความ</h3>
            <p className="text-sm text-muted-foreground">
              ดู แก้ไข และจัดการบทความทั้งหมด
            </p>
          </Card>

          {(session.user.role === "ADMIN" ||
            session.user.role === "SUPER_ADMIN") && (
            <Card
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push("/admin/users")}
            >
              <h3 className="font-bold mb-2">จัดการผู้ใช้</h3>
              <p className="text-sm text-muted-foreground">
                จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function PermissionItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
