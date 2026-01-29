import { Locale } from "./i18n";

const translations = {
  en: {
    nav: {
      home: "Home",
      politics: "Politics",
      business: "Business",
      technology: "Technology",
      culture: "Culture",
      sports: "Sports",
    },
    common: {
      readMore: "Read More",
      trending: "Trending",
      featured: "Featured",
      latestNews: "Latest News",
      categories: "Categories",
    },
    auth: {
      signIn: "Sign In",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
    },
    admin: {
      dashboard: "Dashboard",
      posts: "Posts",
      media: "Media",
      users: "Users",
      settings: "Settings",
      createPost: "Create Post",
      editPost: "Edit Post",
    },
  },
  th: {
    nav: {
      home: "หน้าแรก",
      politics: "การเมือง",
      business: "ธุรกิจ",
      technology: "เทคโนโลยี",
      culture: "วัฒนธรรม",
      sports: "กีฬา",
    },
    common: {
      readMore: "อ่านเพิ่มเติม",
      trending: "กำลังเป็นที่นิยม",
      featured: "เรื่องเด่น",
      latestNews: "ข่าวล่าสุด",
      categories: "หมวดหมู่",
    },
    auth: {
      signIn: "เข้าสู่ระบบ",
      signOut: "ออกจากระบบ",
      email: "อีเมล",
      password: "รหัสผ่าน",
    },
    admin: {
      dashboard: "แดชบอร์ด",
      posts: "โพสต์",
      media: "สื่อ",
      users: "ผู้ใช้",
      settings: "การตั้งค่า",
      createPost: "สร้างโพสต์",
      editPost: "แก้ไขโพสต์",
    },
  },
};

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en;
}
