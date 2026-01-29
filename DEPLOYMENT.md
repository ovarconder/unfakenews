# Deployment Guide

## 🚀 Deploying to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

### Step 1: Prepare Your Repository

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: UnfakeNews platform"
```

2. Push to GitHub:
```bash
git remote add origin https://github.com/yourusername/unfakenews.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to link your project
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings (Vercel auto-detects Next.js)
5. Click "Deploy"

### Step 3: Environment Variables

Add these environment variables in Vercel Dashboard:

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key-here
```

To generate a secure secret:
```bash
openssl rand -base64 32
```

### Step 4: Domain Configuration

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

## 🌐 Alternative Deployment Options

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

### Railway

1. Create new project
2. Link GitHub repo
3. Add environment variables
4. Railway auto-detects Next.js
5. Deploy

### Docker

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t unfakenews .
docker run -p 3000:3000 unfakenews
```

## ⚙️ Production Configuration

### next.config.ts

Add production optimizations:

```typescript
const nextConfig = {
  output: 'standalone', // For Docker
  images: {
    domains: ['images.unsplash.com'], // Add your image domains
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
};
```

### Environment Variables

Required for production:
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<secure-secret>
DATABASE_URL=<your-database-url>
```

Optional:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
CLOUDINARY_URL=<cloudinary-url>
SENDGRID_API_KEY=<sendgrid-key>
```

## 📊 Performance Optimization

### Image Optimization
Replace Unsplash URLs with Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src={article.image}
  alt={article.title}
  width={1200}
  height={800}
  priority={featured}
/>
```

### Static Generation
Enable ISR for article pages:
```tsx
export const revalidate = 3600; // Revalidate every hour
```

### Database Connection
Use connection pooling:
- Prisma: Built-in pooling
- PostgreSQL: PgBouncer
- MySQL: ProxySQL

## 🔒 Security Checklist

- [ ] Change NEXTAUTH_SECRET to secure random string
- [ ] Enable HTTPS only
- [ ] Set up CSP headers
- [ ] Configure CORS properly
- [ ] Rate limit API routes
- [ ] Validate all user inputs
- [ ] Sanitize HTML content
- [ ] Use environment variables for secrets
- [ ] Enable security headers
- [ ] Set up monitoring

### Security Headers

Add to `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ];
},
```

## 📈 Monitoring & Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to layout:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking
Consider integrating:
- Sentry
- LogRocket
- Rollbar

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
```

## 💾 Database Setup

### PostgreSQL on Vercel
1. Go to Storage tab
2. Create Postgres database
3. Copy connection string
4. Add to environment variables

### Prisma Setup
```bash
npm install @prisma/client
npm install -D prisma

npx prisma init
npx prisma db push
npx prisma generate
```

## 🧪 Testing Before Deploy

```bash
# Build locally
npm run build

# Test production build
npm start

# Check for errors
npm run lint

# Test in production mode
NODE_ENV=production npm start
```

## 📝 Post-Deployment

1. Test all routes
2. Check error logs
3. Monitor performance
4. Set up alerts
5. Configure backups
6. Update documentation
7. Monitor costs

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (20+)
- Clear `.next` folder
- Verify all dependencies installed
- Check TypeScript errors

### Environment Variables Not Working
- Prefix client vars with `NEXT_PUBLIC_`
- Rebuild after adding variables
- Check Vercel dashboard for typos

### Images Not Loading
- Add domains to `next.config.ts`
- Check image URLs are accessible
- Verify Image component usage

### Slow Performance
- Enable ISR/SSG where possible
- Optimize images
- Check database queries
- Use CDN for static assets

---

Your app is production-ready! 🎉
