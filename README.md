# MOBI EA - Trading Robot Management Dashboard

A modern, responsive React + Vite + React Router application for managing trading robots and monitoring trading signals. Built with a sleek dark theme and optimized for mobile and desktop deployment.

## Features

- 🤖 **Robot Management**: Add, monitor, and control trading robots
- 📊 **Real-time Signals**: Track live trading signals and market quotes
- 🎯 **MetaTrader Integration**: View signals, quotes, and trade logs
- ⚙️ **Settings Dashboard**: Customize preferences and manage your profile
- 🌙 **Dark/Light Theme Support**: Professional UI with theme switching
- 📱 **Mobile Responsive**: Optimized for all screen sizes
- 🔐 **License Management**: Validate and manage trading licenses
- 🚀 **Fast Performance**: Optimized with Vite build system

## Deployment on Render

### Quick Start

1. **Prepare your repo**
   - Commit the `mobi-ea-app` folder and `render.yaml` to your repository.
   - If you are uploading a zip directly, upload the contents of `mobi-ea-app.zip`.
2. **Create Render Service**:
   - Go to https://dashboard.render.com
   - Click **New +** → **Web Service**
   - Connect your GitHub repository (or upload the zip)
   - Set the root directory to `mobi-ea-app` if your repository contains multiple folders.
3. **Configure**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Set environment variables:
     - `VITE_API_BASE_PATH=/api`
     - `API_BASE_URL=https://mobieaexpert.com/admin/api`
     - `LICENSE_PATH=/validate_license.php`
     - `SIGNALS_PATH=/signals.php`
     - `QUOTES_PATH=/quotes.php`
     - `META_API_BASE_URL=https://mt5.mtapi.io`
     - `META_API_KEY=` (your MetaTrader API key if required)
     - `IMAGE_PROXY_ALLOW_LIST=mobieaexpert.com`
     - `NODE_ENV=production`
4. **Deploy**: Render will install dependencies, build the app, and start the Express server.

### Notes

- The app uses a backend proxy at `/api/*` to keep license and trade requests secure.
- Do not store private keys or secrets in the frontend; use the Render environment variables instead.
- If your API URLs are different, update `render.yaml` and the corresponding environment variables.

Your app will be live at a Render-provided URL after deployment.

## Development

```bash
npm install
npm run dev
```

## Build & Deploy Locally

```bash
npm run build
npm start
```

**Status**: Production Ready ✅
