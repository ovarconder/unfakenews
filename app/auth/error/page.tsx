"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: "ข้อผิดพลาดในการตั้งค่า",
      description: "มีปัญหาในการตั้งค่าระบบ กรุณาติดต่อผู้ดูแลระบบ",
    },
    AccessDenied: {
      title: "การเข้าถึงถูกปฏิเสธ",
      description: "คุณไม่มีสิทธิ์เข้าถึงระบบนี้",
    },
    Verification: {
      title: "การยืนยันล้มเหลว",
      description: "ลิงก์ยืนยันหมดอายุหรือไม่ถูกต้อง",
    },
    OAuthSignin: {
      title: "ไม่สามารถเชื่อมต่อกับ Google",
      description: "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google OAuth",
    },
    OAuthCallback: {
      title: "ข้อผิดพลาด Callback",
      description: "เกิดข้อผิดพลาดในการรับข้อมูลจาก Google",
    },
    OAuthCreateAccount: {
      title: "ไม่สามารถสร้างบัญชี",
      description: "ไม่สามารถสร้างบัญชีจาก Google ได้",
    },
    EmailCreateAccount: {
      title: "ไม่สามารถสร้างบัญชี",
      description: "ไม่สามารถสร้างบัญชีด้วยอีเมลได้",
    },
    Callback: {
      title: "ข้อผิดพลาด Callback",
      description: "เกิดข้อผิดพลาดในการ callback",
    },
    OAuthAccountNotLinked: {
      title: "บัญชีถูกใช้งานแล้ว",
      description: "อีเมลนี้เชื่อมโยงกับวิธีเข้าสู่ระบบอื่นอยู่แล้ว",
    },
    EmailSignin: {
      title: "ไม่สามารถส่งอีเมล",
      description: "ไม่สามารถส่งอีเมลยืนยันได้",
    },
    CredentialsSignin: {
      title: "ข้อมูลไม่ถูกต้อง",
      description: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    },
    SessionRequired: {
      title: "จำเป็นต้องเข้าสู่ระบบ",
      description: "กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้",
    },
    Default: {
      title: "เกิดข้อผิดพลาด",
      description: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง",
    },
  };

  const errorInfo = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6 flex justify-center"
        >
          <div className="bg-red-100 rounded-full p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-3 text-gray-900"
          >
            {errorInfo.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-2"
          >
            {errorInfo.description}
          </motion.p>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-500 mt-4 font-mono bg-gray-100 p-2 rounded"
            >
              Error code: {error}
            </motion.p>
          )}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Link
            href="/auth/signin"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ลองอีกครั้ง
          </Link>

          <Link
            href="/th"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าแรก
          </Link>
        </motion.div>

        {/* Help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          หากปัญหายังคงอยู่ กรุณาติดต่อ{" "}
          <a href="mailto:support@unfakenews.asia" className="text-blue-600 hover:underline">
            support@unfakenews.asia
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full">
            <div className="mb-6 flex justify-center">
              <div className="bg-red-100 rounded-full p-4">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-3 text-gray-900">กำลังโหลด...</h1>
            </div>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
