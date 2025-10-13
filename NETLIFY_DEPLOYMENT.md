# Netlify Deployment Guide for HooInvest

## 📦 What Gets Deployed

**Deploy the entire project folder:**
```
/Users/jhoo/Documents/app1/hooinvest-mvp2/
```

This includes:
- All source code (`/app`, `/components`, `/lib`)
- Configuration files (`package.json`, `next.config.js`, `tailwind.config.js`)
- `netlify.toml` (Netlify configuration - already created ✅)
- Public assets (`/public`)

**Do NOT include:**
- `node_modules/` (Netlify installs these)
- `.next/` (Netlify builds this)
- `.env.local` (add secrets in Netlify dashboard instead)

---

## 🚀 Deployment Methods

### Method 1: Git-Based Deploy (Recommended)

**Step 1: Initialize Git (if not already done)**
```bash
cd /Users/jhoo/Documents/app1/hooinvest-mvp2
git init
git add .
git commit -m "Initial commit: HooInvest public website"
```

**Step 2: Push to GitHub/GitLab**
```bash
# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/hooinvest-mvp2.git
git branch -M main
git push -u origin main
```

**Step 3: Deploy on Netlify**
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** (or GitLab/Bitbucket)
4. Select your repository: `hooinvest-mvp2`
5. Netlify auto-detects settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Framework:** Next.js
6. Click **"Deploy site"**

✅ **Automatic deploys:** Every time you push to `main`, Netlify rebuilds automatically!

---

### Method 2: Netlify CLI Deploy

**Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

**Step 2: Login to Netlify**
```bash
netlify login
```

**Step 3: Deploy**
```bash
cd /Users/jhoo/Documents/app1/hooinvest-mvp2
netlify deploy --prod
```

Follow prompts to:
- Create a new site or link to existing
- Confirm build directory: `.next`
- Confirm publish

---

### Method 3: Manual Drag & Drop

⚠️ **Not recommended for Next.js** - Use Git or CLI instead

Next.js requires server-side rendering, which doesn't work well with simple drag & drop.

---

## 🔐 Environment Variables Setup

After deploying, add environment variables in Netlify:

**Go to:** Site settings → Environment variables → Add a variable

**Required Variables:**

| Key | Value | Notes |
|-----|-------|-------|
| `NEXT_PUBLIC_SHEETDB_API_URL` | `https://sheetdb.io/api/v1/2us7uzil3y277` | Public leads endpoint |

**Optional Variables:**

| Key | Value | Notes |
|-----|-------|-------|
| `SHEETSDB_PUBLIC_TABLE` | `public_leads` | If using multiple sheets/tabs |
| `NODE_ENV` | `production` | Usually auto-set by Netlify |

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [ ] **Build works locally:**
  ```bash
  cd /Users/jhoo/Documents/app1/hooinvest-mvp2
  npm run build
  ```
  Should complete without errors

- [ ] **Forms work locally:**
  - Test http://localhost:3001/business
  - Test http://localhost:3001/investors
  - Verify data appears in Google Sheet

- [ ] **Google Sheet has headers:**
  - Row 1 has all 39 column headers
  - Headers match `sheet-headers-public-leads.txt`

- [ ] **Git is clean:**
  ```bash
  git status
  ```
  All files committed

- [ ] **netlify.toml exists** (✅ Already created for you)

---

## 📁 Files Netlify Needs

### Essential Files (Must Deploy)
```
hooinvest-mvp2/
├── app/                    # All pages and API routes
├── components/             # All React components
├── lib/                    # Utilities, validation, clients
├── public/                 # Static assets
├── package.json            # Dependencies
├── package-lock.json       # Lock file
├── next.config.js          # Next.js config
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
├── tsconfig.json           # TypeScript config
└── netlify.toml            # Netlify config (✅ created)
```

### Files to IGNORE (Don't Deploy)
```
.next/                      # Build output (Netlify generates this)
node_modules/               # Dependencies (Netlify installs these)
.env.local                  # Local secrets (use Netlify env vars instead)
.git/                       # Git metadata (fine to include)
```

---

## 🌐 After Deployment

### 1. Get Your Site URL
Netlify assigns a URL like: `https://amazing-site-123456.netlify.app`

### 2. Test Your Live Site
- Visit: `https://YOUR-SITE.netlify.app`
- Test: `https://YOUR-SITE.netlify.app/business`
- Test: `https://YOUR-SITE.netlify.app/investors`
- Submit forms and verify Google Sheet updates

### 3. Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Add custom domain: `hooinvest.com`
3. Update DNS records as instructed
4. Netlify provides free SSL certificate

---

## 🔧 Build Configuration

Netlify will use these settings (from `netlify.toml`):

```toml
Build command:    npm run build
Publish directory: .next
Node version:     18
Framework:        Next.js (auto-detected)
```

---

## 🐛 Troubleshooting

### Build Fails on Netlify

**Error:** "npm run build failed"

**Solution:**
1. Run `npm run build` locally first
2. Fix any TypeScript errors
3. Commit and push fixes
4. Netlify will auto-retry

### Forms Don't Work on Production

**Check:**
1. Environment variables set in Netlify dashboard
2. `NEXT_PUBLIC_SHEETDB_API_URL` is correct
3. Google Sheet has headers in Row 1
4. Check Netlify Function logs for errors

### "Function bundling failed"

**Solution:**
- Ensure all imports use correct paths
- Check for missing dependencies in `package.json`
- Verify no edge runtime incompatibilities

---

## 📊 Monitoring After Deploy

### View Logs
1. Netlify Dashboard → Deploys → (Latest deploy)
2. Click "Functions" to see API route logs
3. Check for errors in `/api/public-leads`

### Form Submissions
- Monitor Google Sheet for new rows
- Check `RecordType` column to filter Business vs Investor
- Review `Status` column to manage leads

---

## 🎯 Quick Deploy Commands

```bash
# Clean build
cd /Users/jhoo/Documents/app1/hooinvest-mvp2
rm -rf .next node_modules
npm install
npm run build

# Deploy with Netlify CLI
netlify deploy --prod

# Or commit and push (if using Git)
git add .
git commit -m "Ready for production"
git push
```

---

## ✅ You're Ready to Deploy!

Your project includes:
- ✅ Working homepage with CTAs
- ✅ Business lead form → Google Sheets
- ✅ Investor lead form → Google Sheets  
- ✅ About page with team info
- ✅ Dark/Light theme toggle
- ✅ Mobile responsive
- ✅ SEO optimized
- ✅ `netlify.toml` configuration

**Just push to Git or use Netlify CLI and you're live!** 🚀


