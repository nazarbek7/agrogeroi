# Deployment Guide

## Stack
- **Frontend:** Next.js → Vercel
- **Backend:** Express.js → Railway
- **Database:** MongoDB Atlas (already configured)
- **Domain:** Namecheap

---

## 1. Deploy Express Server to Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your repo → choose **`server/`** as the root directory
3. Set environment variables in Railway dashboard:
   ```
   NODE_ENV=production
   DATABASE_URL=mongodb+srv://avengersjobs7_db_user:...@agrogeroicluster.qvsevtd.mongodb.net/agrogeroi?retryWrites=true&w=majority
   PORT=3001
   FRONTEND_URL=https://yourdomain.com
   NEXTAUTH_URL=https://yourdomain.com
   ```
4. After deploy, copy the Railway URL (e.g. `https://agrogeroi-server.up.railway.app`)

---

## 2. Deploy Next.js to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select your repo (root directory = `/`)
3. Set environment variables in Vercel dashboard:
   ```
   DATABASE_URL=mongodb+srv://avengersjobs7_db_user:...@agrogeroicluster.qvsevtd.mongodb.net/agrogeroi?retryWrites=true&w=majority
   NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_API_BASE_URL=https://agrogeroi-server.up.railway.app
   NODE_ENV=production
   ```
4. Deploy

---

## 3. Configure Custom Domain on Vercel

1. In Vercel project → Settings → Domains → Add Domain
2. Enter your domain: `yourdomain.com`
3. Vercel will show you DNS records to add

---

## 4. Configure Namecheap DNS

Go to Namecheap → Domain List → Manage → Advanced DNS

Add these records (Vercel will give you the exact values):

| Type  | Host | Value                          |
|-------|------|--------------------------------|
| A     | @    | 76.76.21.21 (Vercel IP)        |
| CNAME | www  | cname.vercel-dns.com           |

For the API subdomain (Railway):
| Type  | Host | Value                                        |
|-------|------|----------------------------------------------|
| CNAME | api  | your-railway-app.up.railway.app              |

---

## 5. Update Production Environment Variables

After getting your domain, update these:
- **Vercel:** `NEXTAUTH_URL=https://yourdomain.com`
- **Railway:** `FRONTEND_URL=https://yourdomain.com`
- **NEXT_PUBLIC_API_BASE_URL** = your Railway URL or `https://api.yourdomain.com`

---

## MongoDB Atlas Network Access

Make sure your MongoDB Atlas cluster allows connections from:
- **0.0.0.0/0** (all IPs) — for Vercel/Railway serverless
- Or add specific IPs for Railway static IPs

Go to: Atlas → Network Access → Add IP Address → Allow Access from Anywhere
