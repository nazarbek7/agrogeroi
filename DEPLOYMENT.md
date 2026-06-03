# Deployment Guide

## Domains
- **Main:** `agrogeroi.com`
- **Redirect:** `agrogeroi.kg` → `agrogeroi.com` (301 permanent, handled by Next.js)

## Stack
- **Frontend (Next.js):** Vercel → `agrogeroi.com`
- **Backend (Express):** Railway → `api.agrogeroi.com`
- **Database:** MongoDB Atlas

---

## Step 1 — Deploy Express API to Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select `nazarbek7/agrogeroi` repo
3. Set **Root Directory** to `server`
4. Add environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=mongodb+srv://avengersjobs7_db_user:qGs5vZl2Ux6y0Bm4@agrogeroicluster.qvsevtd.mongodb.net/agrogeroi?retryWrites=true&w=majority
   PORT=3001
   FRONTEND_URL=https://agrogeroi.com
   NEXTAUTH_URL=https://agrogeroi.com
   ```
5. After deploy, go to **Settings → Networking → Custom Domain** → add `api.agrogeroi.com`
6. Railway gives you a CNAME value — save it for DNS step

---

## Step 2 — Deploy Next.js to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import `nazarbek7/agrogeroi`
2. Root directory: `/` (default)
3. Add environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=mongodb+srv://avengersjobs7_db_user:qGs5vZl2Ux6y0Bm4@agrogeroicluster.qvsevtd.mongodb.net/agrogeroi?retryWrites=true&w=majority
   NEXTAUTH_SECRET=12D16C923BA17672F89B18C1DB22A
   NEXTAUTH_URL=https://agrogeroi.com
   NEXT_PUBLIC_API_BASE_URL=https://api.agrogeroi.com
   ```
4. Deploy
5. Go to **Settings → Domains** → add `agrogeroi.com` and `agrogeroi.kg`
   - Vercel will show DNS records to add
   - For `agrogeroi.kg` → Vercel auto-redirects to `agrogeroi.com` (already configured in code)

---

## Step 3 — Namecheap DNS Setup

### For agrogeroi.com
Go to **Namecheap → Domain List → Manage → Advanced DNS**

| Type  | Host | Value                    | TTL  |
|-------|------|--------------------------|------|
| A     | @    | 76.76.21.21              | Auto |
| CNAME | www  | cname.vercel-dns.com     | Auto |
| CNAME | api  | `<your-railway-cname>`   | Auto |

### For agrogeroi.kg
Go to your .kg registrar → DNS settings

| Type  | Host | Value                | TTL  |
|-------|------|----------------------|------|
| A     | @    | 76.76.21.21          | Auto |
| CNAME | www  | cname.vercel-dns.com | Auto |

> Vercel handles the 301 redirect from agrogeroi.kg → agrogeroi.com automatically.

---

## Step 4 — MongoDB Atlas Network Access

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Your cluster → **Network Access** → **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. This is required for Vercel and Railway serverless environments

---

## Environment Variables Summary

### Vercel (Next.js)
| Variable | Value |
|----------|-------|
| `DATABASE_URL` | mongodb+srv://... |
| `NEXTAUTH_SECRET` | 12D16C923BA17672F89B18C1DB22A |
| `NEXTAUTH_URL` | https://agrogeroi.com |
| `NEXT_PUBLIC_API_BASE_URL` | https://api.agrogeroi.com |
| `NODE_ENV` | production |

### Railway (Express API)
| Variable | Value |
|----------|-------|
| `DATABASE_URL` | mongodb+srv://... |
| `FRONTEND_URL` | https://agrogeroi.com |
| `NEXTAUTH_URL` | https://agrogeroi.com |
| `NODE_ENV` | production |
| `PORT` | 3001 |
