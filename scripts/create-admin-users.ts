import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🔧 Creating admin users...\n");

  // Super Admin
  const superAdminPassword = await bcrypt.hash("superadmin123", 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@unfakenews.com" },
    update: {},
    create: {
      email: "superadmin@unfakenews.com",
      name: "Super Admin",
      password: superAdminPassword,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Super Admin:", superAdmin.email);

  // Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@unfakenews.com" },
    update: {},
    create: {
      email: "admin@unfakenews.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin:", admin.email);

  // Editor
  const editorPassword = await bcrypt.hash("editor123", 10);
  const editor = await prisma.user.upsert({
    where: { email: "editor@unfakenews.com" },
    update: {},
    create: {
      email: "editor@unfakenews.com",
      name: "Editor",
      password: editorPassword,
      role: "EDITOR",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Editor:", editor.email);

  // User
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@unfakenews.com" },
    update: {},
    create: {
      email: "user@unfakenews.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });
  console.log("✅ User:", user.email);

  console.log("\n🎉 All users created successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Super Admin: superadmin@unfakenews.com / superadmin123");
  console.log("Admin:       admin@unfakenews.com / admin123");
  console.log("Editor:      editor@unfakenews.com / editor123");
  console.log("User:        user@unfakenews.com / user123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
