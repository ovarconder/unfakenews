# UnfakeNews - Premium News Magazine Platform

A professional, minimalist, and high-performance newspaper/magazine web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Minimalist Luxury Design** - High-end typography with Noto Sans Thai font
- 🌐 **Multilingual Support** - i18n structure for Thai and English (easily extensible)
- 🔐 **Authentication** - NextAuth.js with role-based access control
- 👥 **User Roles** - SUPER_ADMIN, EDITOR, and AUTHOR with protected routes
- 📊 **Admin Dashboard** - Comprehensive content management system
- 📝 **Post Management** - Full CRUD operations for articles
- 🖼️ **Media Library** - Organized media management
- 👤 **User Management** - Role assignment and user administration
- ✨ **Smooth Animations** - Framer Motion for elegant transitions
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🎯 **shadcn/ui Components** - Beautiful, accessible UI components

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Authentication:** NextAuth.js
- **Font:** Noto Sans Thai (Google Fonts)

## Project Structure

```
UnfakeNews/
├── app/
│   ├── [lang]/              # Localized routes (en, th)
│   │   ├── layout.tsx       # Main layout with navbar & footer
│   │   ├── page.tsx         # Home page
│   │   ├── article/[id]/    # Article detail pages
│   │   └── auth/            # Authentication pages
│   ├── admin/               # Admin dashboard
│   │   ├── layout.tsx       # Admin layout with sidebar
│   │   ├── page.tsx         # Dashboard overview
│   │   ├── posts/           # Post management
│   │   ├── media/           # Media library
│   │   ├── users/           # User management
│   │   └── settings/        # Settings
│   └── api/
│       └── auth/            # NextAuth API routes
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── admin/               # Admin-specific components
│   ├── navbar.tsx           # Main navigation
│   ├── footer.tsx           # Footer component
│   └── article-card.tsx     # Article display component
├── lib/
│   ├── auth.ts              # Authentication configuration
│   ├── i18n.ts              # Internationalization setup
│   ├── translations.ts      # Translation strings
│   └── utils.ts             # Utility functions
└── types/
    └── next-auth.d.ts       # NextAuth type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Demo Credentials

For testing authentication:
- Email: `admin@unfakenews.com`
- Password: `password123`

Available users:
- **Super Admin:** admin@unfakenews.com (SUPER_ADMIN role)
- **Editor:** editor@unfakenews.com (EDITOR role)
- **Author:** author@unfakenews.com (AUTHOR role)

All demo accounts use password: `password123`

## Features in Detail

### Multilingual Support

The application supports multiple languages through URL-based routing:
- English: `/en`
- Thai: `/th`

Add new languages by updating:
1. `lib/i18n.ts` - Add locale to the `locales` array
2. `lib/translations.ts` - Add translation strings

### Authentication & Authorization

Built with NextAuth.js featuring:
- Credential-based authentication
- JWT session strategy
- Role-based access control (RBAC)
- Protected admin routes

### Admin Dashboard

Comprehensive admin panel includes:
- **Dashboard:** Overview with statistics and recent activity
- **Posts:** Create, edit, and manage articles
- **Media:** Upload and organize images
- **Users:** Manage users and assign roles
- **Settings:** Configure site settings

### Design Philosophy

- **Typography:** Noto Sans Thai for excellent Thai and English readability
- **Colors:** Refined Zinc/Slate color palette
- **Spacing:** Generous whitespace for clarity
- **Borders:** Subtle borders for elegant separation
- **Animations:** Smooth, purposeful transitions

## Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Configure environment variables
4. Deploy

The application is optimized for Vercel deployment with automatic:
- Server-side rendering
- Static generation
- Image optimization
- Edge functions

### Environment Variables

Required environment variables for production:

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
```

## Customization

### Styling

Modify `tailwind.config.ts` to customize:
- Colors
- Typography
- Spacing
- Border radius

Update `app/globals.css` for:
- CSS variables
- Dark mode colors
- Global styles

### Content

Replace mock data in pages with your actual data source:
- Database (PostgreSQL, MongoDB, etc.)
- CMS (Strapi, Contentful, etc.)
- API endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@unfakenews.com or open an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript
