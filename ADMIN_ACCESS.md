# Admin Sign-In Access Guide

## Overview

The admin sign-in page is **hidden from public view** but accessible to internal team members through a discreet trigger.

## 🔐 How to Access Admin Sign-In

### Method 1: Hidden Trigger (Recommended)

On any public page (Homepage, Business, Investors, About):

1. **Scroll to the bottom** of the page
2. **Move your cursor to the bottom-right corner** of the screen
3. **Click the invisible area** (8x8 pixel zone at the very bottom-right)
4. You'll be redirected to `/auth/sign-in`

**Tip:** Hover over the bottom-right corner - the cursor will change to a pointer when you're in the right spot, and it will become slightly visible (10% opacity on hover).

### Method 2: Direct URL

Simply navigate to:
```
http://localhost:3001/auth/sign-in
```

Or in production:
```
https://your-domain.com/auth/sign-in
```

## 📍 Sign-In Page Details

**Route:** `/auth/sign-in`

**Features:**
- Email/password authentication via Supabase
- Sign up capability
- Redirects to `/dashboard` after successful login
- Email confirmation for new signups

**Demo Accounts (as shown on page):**
- Business: `business@example.com`
- Admin: `admin@hooinvest.com`

## 🚫 Not Visible In

The sign-in page is **intentionally hidden** from:
- ❌ Navigation menus
- ❌ Header links
- ❌ Footer link lists
- ❌ Sitemap
- ❌ Search engine indexing (should add `noindex` meta tag for production)

## 🔒 Security Notes

1. **Hidden ≠ Secure** - The page is still accessible via direct URL
2. For production, consider:
   - Adding rate limiting to prevent brute force
   - Implementing 2FA for admin accounts
   - Adding IP whitelist for admin access
   - Monitoring failed login attempts

## 📝 Implementation Details

**Hidden Trigger:**
- Fixed position: bottom-right corner (0px from bottom, 0px from right)
- Size: 8x8 pixels
- Opacity: 0 (invisible), 0.1 on hover (barely visible)
- Z-index: 50 (above other content)
- Works on all public pages

**Why This Approach:**
- Doesn't clutter public UI
- Easy for internal team to remember
- Can be changed/removed without affecting public pages
- Maintains clean, professional public appearance

## 🎯 For Internal Team

**To access the admin panel:**
1. Go to any HooInvest page
2. Click the bottom-right corner
3. Or just bookmark: `/auth/sign-in`

**After signing in:**
- Dashboard: `/dashboard`
- Review applications: `/admin/review`
- Publish offerings: `/admin/publish/[id]`
- View docs: `/docs`
- Application details: `/application/[id]`

## 🚀 Production Recommendations

Before deploying to production:

1. **Add noindex meta tag** to `/auth/sign-in`:
   ```tsx
   export const metadata = {
     title: 'Sign In | hooinvest',
     robots: 'noindex, nofollow',
   };
   ```

2. **Optional: Add password to access** the sign-in page itself (extra layer)

3. **Monitor access logs** for unauthorized attempts

4. **Consider IP whitelist** for admin routes in production

---

**Location of hidden trigger:** Bottom-right corner of every public page  
**Target:** `/auth/sign-in`  
**Auth method:** Supabase (email/password)  
**Post-login redirect:** `/dashboard`

