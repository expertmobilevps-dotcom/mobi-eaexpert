# MOBI EA - Deployment Guide for Render

This guide will walk you through deploying the MOBI EA application on Render.com.

## Prerequisites

- ✅ GitHub account with this repository
- ✅ Render.com account (free tier available)
- ✅ Your API endpoints configured
- ✅ Environment variables ready

## Step 1: Prepare Your Repository

1. **Initialize Git (if not already done)**:
```bash
cd mobi-ea-app
git init
git add .
git commit -m "Initial commit - MOBI EA app"
```

2. **Push to GitHub**:
   - Create a new repository on GitHub
   - Add remote and push:
```bash
git remote add origin https://github.com/yourusername/mobi-ea-app.git
git branch -M main
git push -u origin main
```

## Step 2: Create Render Account & Connect GitHub

1. Go to [https://render.com](https://render.com)
2. Sign up or log in
3. Go to Dashboard
4. Click "Connect Account" under GitHub
5. Authorize Render to access your GitHub repositories

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. In Render Dashboard, click **"New +"**
2. Select **"Infrastructure as Code"**
3. Paste your GitHub repository URL
4. Click **"Deploy"**
5. Render will use `render.yaml` for configuration

### Option B: Manual Configuration

1. In Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub account
4. Select the `mobi-ea-app` repository
5. Configure settings:
   - **Name**: `mobi-ea-app` (or your preferred name)
   - **Root Directory**: `.` (or the path to mobi-ea-app folder)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free tier

6. Click **"Create Web Service"**

## Step 4: Configure Environment Variables

1. After deployment starts, go to your service's **Settings**
2. Scroll to **Environment Variables**
3. Add the following variables:

```
VITE_API_URL     = https://yourdomain.com/api
VITE_APP_NAME    = MOBI EA
VITE_APP_VERSION = 1.0.0
NODE_ENV         = production
```

4. **Important**: Update `VITE_API_URL` with your actual API domain

## Step 5: Monitor Deployment

1. Click on the **"Logs"** tab to watch the build process
2. You should see:
   - `npm install` completing
   - `npm run build` creating the production build
   - `npm start` starting the server

3. Once complete, your app will be live at:
   - `https://mobi-ea-app.onrender.com` (free domain)
   - Or your custom domain if configured

## Step 6: Set Up Custom Domain (Optional)

1. Go to **Settings** → **Custom Domain**
2. Add your domain (e.g., `app.yourdomain.com`)
3. Follow DNS configuration instructions
4. Render will auto-provision SSL certificate

## Troubleshooting

### Build Fails

**Check logs** for specific error:
```
Build command: npm install && npm run build
```

**Common issues**:
- Missing dependencies: Ensure `package.json` has all required packages
- Node version: Render uses Node 18+ by default
- API URL: Check that environment variables are set

### App Shows Blank Page

1. Open browser **Developer Console** (F12)
2. Check for JavaScript errors
3. Verify API URL is correct and accessible

### "Cannot find module" Error

1. Delete node_modules locally: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`
4. Test locally: `npm start`
5. Push to GitHub and redeploy

### Port Issues

- Render automatically sets `PORT` environment variable
- Our server respects this: `const PORT = process.env.PORT || 3000`
- No manual port configuration needed

## Automatic Deployments

Every time you push to your main branch, Render will:
1. Automatically trigger a new build
2. Run `npm install && npm run build`
3. Restart the server
4. Deploy the new version

No additional action needed!

## Local Testing Before Deployment

Before pushing to GitHub, test the production build locally:

```bash
# Build production bundle
npm run build

# Serve production build
npm start
```

Visit `http://localhost:3000` to test.

## Performance Tips

1. **Build Size**: Check Render logs for bundle size
   - Should be < 500KB gzipped for fast loads
   
2. **Cold Starts**: Free tier has cold starts
   - First request may take 30 seconds
   - Paid plans prevent cold starts

3. **Environment**: Upgrade from Free to Standard plan for:
   - Faster builds
   - Better performance
   - SSL included
   - Custom domains

## Cost Optimization

- **Free Tier**: Perfect for development/testing
- **Instance**: $7/month for production
- **Database**: Add PostgreSQL if needed ($15/month)

## Monitoring

Render provides:
- **Logs**: Real-time access to application logs
- **Metrics**: CPU, memory, request count
- **Events**: Deployment history
- **Alerts**: Get notified of issues (paid feature)

## Next Steps

1. ✅ Configure your API endpoints in `src/services/api.js`
2. ✅ Update environment variables with actual API URL
3. ✅ Test the login flow
4. ✅ Monitor logs for any issues
5. ✅ Set up a custom domain
6. ✅ Enable 2FA on Render account for security

## Support Resources

- **Render Docs**: https://render.com/docs
- **Deploy Status**: https://status.render.com
- **Community**: https://community.render.com

## Rollback to Previous Version

If deployment has issues:
1. Go to **Deploys** tab
2. Click on previous successful deploy
3. Click **"Redeploy"**
4. Render will restore previous version

## Environment Variables Reference

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| VITE_API_URL | https://api.example.com | Yes | Backend API URL |
| VITE_APP_NAME | MOBI EA | No | App display name |
| VITE_APP_VERSION | 1.0.0 | No | Version info |
| NODE_ENV | production | Auto | Node environment |

## Redeploy/Rebuild

To force a rebuild and redeploy:
1. Go to **Deploys** tab
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**
4. Render will rebuild and deploy

---

**Your app is now live on Render!** 🚀

For questions or issues, check the logs first, then refer to Render's documentation.
