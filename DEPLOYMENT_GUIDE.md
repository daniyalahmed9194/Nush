# 🚀 GoDaddy Deployment Guide

## Step-by-Step Guide for Shared Hosting

### 📋 Pre-Deployment Checklist

- [ ] GoDaddy shared hosting account ready
- [ ] Domain configured
- [ ] Railway/Render account created for backend
- [ ] Supabase database configured

---

## Part 1: Backend Deployment (Railway)

### 1️⃣ Deploy to Railway

1. **Visit**: https://railway.app
2. **Sign up** with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"** (or upload code)

### 2️⃣ Configure Environment Variables

Railway Dashboard → Variables → Add:

```
DATABASE_URL=your_supabase_connection_string
ADMIN_USERNAME=nushadmin
ADMIN_PASSWORD=SecurePass@2026
ADMIN_NAME=Restaurant Manager
NODE_ENV=production
PORT=5000
```

### 3️⃣ Configure Build Settings

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Root Directory**: `/`

### 4️⃣ Copy Your Backend URL

After deployment, Railway will give you:
```
https://your-app-name.railway.app
```

**✅ Save this URL** - you'll need it in the next step!

---

## Part 2: Frontend Configuration

### 1️⃣ Update Production Environment

Edit `client/.env.production`:

```env
VITE_API_URL=https://your-app-name.railway.app
```

Replace `https://your-app-name.railway.app` with your actual Railway URL.

### 2️⃣ Build Frontend

```bash
cd client
npm run build
```

This creates a `dist` folder with all files.

---

## Part 3: GoDaddy Upload

### Method A: cPanel File Manager

1. **Login to GoDaddy**:
   - Go to: https://www.godaddy.com
   - My Products → Web Hosting → Manage

2. **Open cPanel**:
   - Find "cPanel Admin" button

3. **Access File Manager**:
   - cPanel → Files → File Manager
   - Open `public_html` folder

4. **Clear Old Files**:
   - Select all files in `public_html`
   - Delete them

5. **Upload Build Files**:
   - Click "Upload" button
   - Navigate to your `client/dist` folder
   - Select ALL files (Ctrl+A)
   - Upload

6. **Create .htaccess**:
   - In `public_html`, create new file: `.htaccess`
   - Add this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Method B: FileZilla (FTP)

1. **Get FTP Credentials**:
   - cPanel → Files → FTP Accounts
   - Copy credentials

2. **Connect via FileZilla**:
   - Host: `ftp.yourdomain.com`
   - Username: `your_username`
   - Password: `your_password`
   - Port: `21`

3. **Upload Files**:
   - Left panel: Navigate to `client/dist`
   - Right panel: Navigate to `public_html`
   - Drag all files from left to right

4. **Upload .htaccess** (same as above)

---

## Part 4: Backend CORS Configuration

Update `server/index.ts` to allow your domain:

```typescript
import cors from "cors";

app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:5000', // for local testing
  ],
  credentials: true
}));
```

Redeploy to Railway after this change.

---

## Part 5: Testing

### ✅ Test Customer Side

1. Visit: `https://yourdomain.com`
2. Browse menu
3. Add items to cart
4. Fill checkout form
5. Submit order

### ✅ Test Admin Dashboard

1. Visit: `https://yourdomain.com/admin`
2. Login with credentials:
   - Username: `nushadmin`
   - Password: `SecurePass@2026`
3. Check if orders appear
4. Test order status updates
5. Verify real-time notifications

---

## 🔧 Troubleshooting

### Issue: "404 Not Found" on page refresh

**Solution**: Check `.htaccess` file in `public_html`

### Issue: "CORS Error" in console

**Solution**: Add your domain to CORS configuration in `server/index.ts`

### Issue: "WebSocket connection failed"

**Solution**: Railway automatically supports WebSockets. Ensure `wss://` protocol is used (handled automatically by `api.ts`)

### Issue: "Failed to fetch" errors

**Solution**: 
1. Check `client/.env.production` has correct Railway URL
2. Rebuild frontend: `npm run build`
3. Re-upload to GoDaddy

### Issue: Admin can't login

**Solution**: 
1. Check Railway logs for errors
2. Verify environment variables in Railway
3. Check database connection

---

## 📞 Client Handoff

Send these credentials to your client:

```
Restaurant Website: https://yourdomain.com
Admin Dashboard: https://yourdomain.com/admin

Admin Login Credentials:
Username: nushadmin
Password: SecurePass@2026

⚠️ Please change password after first login
```

---

## 🔐 Security Notes

1. **Change Admin Password**: After deployment, consider adding password change feature
2. **Environment Variables**: Never commit `.env` files to Git
3. **HTTPS Only**: Always use HTTPS in production
4. **Database Backups**: Supabase automatically backs up data

---

## 📊 Monitoring

- **Railway Dashboard**: Monitor backend health and logs
- **Supabase Dashboard**: Monitor database queries
- **GoDaddy cPanel**: Monitor traffic and bandwidth

---

## 💰 Cost Estimate

- **GoDaddy Shared Hosting**: Client already has
- **Railway**: 
  - Free tier: $5 credit/month (enough for small apps)
  - Paid: ~$5-10/month for this app
- **Supabase**: Free tier (2 projects, 500MB database)

---

## 🎯 Quick Commands Reference

```bash
# Build frontend
cd client && npm run build

# Test locally before deployment
npm run dev

# Push database schema changes
npm run db:push

# Check Railway logs
# Visit: Railway Dashboard → Deployments → View Logs
```

---

Good luck with deployment! 🚀
