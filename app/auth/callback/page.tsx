"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("กำลังเข้าสู่ระบบ...");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // Debug: Collect all URL params
    const allParams: any = {};
    searchParams.forEach((value, key) => {
      allParams[key] = value;
    });
    
    setDebugInfo({
      status,
      params: allParams,
      hasSession: !!session,
      sessionUser: session?.user?.email || null,
    });

    // Check for error in URL params
    const error = searchParams.get("error");
    
    if (error) {
      console.error("[Auth Callback] Error:", error);
      setState("error");
      setMessage(getErrorMessage(error));
      setTimeout(() => {
        router.push("/auth/signin");
      }, 5000); // เพิ่มเวลาเพื่อดู error
      return;
    }

    // Wait for session to load
    if (status === "loading") {
      setState("loading");
      setMessage("กำลังเข้าสู่ระบบ...");
      return;
    }

    if (status === "authenticated" && session) {
      console.log("[Auth Callback] Success:", session.user);
      setState("success");
      setMessage(`ยินดีต้อนรับ ${session.user?.name || session.user?.email}!`);
      
      // Redirect based on role
      setTimeout(() => {
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (session.user?.role === "ADMIN" || session.user?.role === "SUPER_ADMIN" || session.user?.role === "EDITOR") {
          router.push("/admin");
        } else {
          router.push("/th");
        }
      }, 1500);
      return;
    }

    if (status === "unauthenticated") {
      console.error("[Auth Callback] Unauthenticated");
      setState("error");
      setMessage("ไม่สามารถเข้าสู่ระบบได้");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    }
  }, [status, session, searchParams, router]);

  function getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      OAuthSignin: "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google",
      OAuthCallback: "เกิดข้อผิดพลาดในการ callback - ตรวจสอบ DATABASE_URL",
      OAuthCreateAccount: "ไม่สามารถสร้างบัญชีได้ - ตรวจสอบ database connection",
      EmailCreateAccount: "ไม่สามารถสร้างบัญชีได้",
      Callback: "เกิดข้อผิดพลาดในการ callback",
      OAuthAccountNotLinked: "บัญชีนี้เชื่อมโยงกับวิธีเข้าสู่ระบบอื่นอยู่แล้ว",
      EmailSignin: "ไม่สามารถส่งอีเมลได้",
      CredentialsSignin: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง",
      SessionRequired: "กรุณาเข้าสู่ระบบ",
      Configuration: "ข้อผิดพลาดในการตั้งค่า - ตรวจสอบ environment variables",
      AccessDenied: "การเข้าถึงถูกปฏิเสธ",
      Verification: "การยืนยันล้มเหลว",
      Default: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
    };

    return errorMessages[error] || errorMessages.Default;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full"
      >
        <div className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            {state === "loading" && (
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            )}
            {state === "success" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-16 w-16 text-green-600" />
              </motion.div>
            )}
            {state === "error" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <XCircle className="h-16 w-16 text-red-600" />
              </motion.div>
            )}
          </motion.div>

          {/* Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-3"
          >
            {state === "loading" && "กำลังดำเนินการ..."}
            {state === "success" && "เข้าสู่ระบบสำเร็จ!"}
            {state === "error" && "เกิดข้อผิดพลาด"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-6"
          >
            {message}
          </motion.p>

          {/* Debug Info */}
          {(state === "error" || process.env.NODE_ENV === "development") && debugInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gray-100 rounded-lg text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <h3 className="font-semibold text-sm">Debug Information:</h3>
              </div>
              <pre className="text-xs overflow-auto max-h-40 text-gray-700">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </motion.div>
          )}

          {/* Progress indicator */}
          {state === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              />
            </motion.div>
          )}

          {/* Success animation */}
          {state === "success" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground"
            >
              กำลังนำคุณไปยังหน้าถัดไป...
            </motion.p>
          )}

          {/* Error retry */}
          {state === "error" && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => router.push("/auth/signin")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-3">กำลังดำเนินการ...</h2>
              <p className="text-muted-foreground mb-6">กำลังเข้าสู่ระบบ...</p>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
