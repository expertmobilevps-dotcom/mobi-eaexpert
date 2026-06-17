#!/usr/bin/env node

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const API_BASE_URL = process.env.API_BASE_URL || 'https://mobieaexpert.com/admin/api';
const LICENSE_PATH = process.env.LICENSE_PATH || '/validate_license.php';
const SIGNALS_PATH = process.env.SIGNALS_PATH || '/signals.php';
const QUOTES_PATH = process.env.QUOTES_PATH || '/quotes.php';
const META_API_BASE_URL = process.env.META_API_BASE_URL || '';
const META_API_KEY = process.env.META_API_KEY || '';
const IMAGE_PROXY_ALLOW_LIST = (process.env.IMAGE_PROXY_ALLOW_LIST || 'mobieaexpert.com').split(',').map((host) => host.trim()).filter(Boolean);

const sessions = new Map();
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

app.use(cors());
app.use(express.json({ limit: '100kb' }));

function getBearerToken(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.slice(7).trim();
}

function requireSession(req, res, next) {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ success: false, message: 'Missing Authorization header' });
  const session = sessions.get(token);
  if (!session) return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
  req.session = session;
  req.sessionId = token;
  next();
}

function buildUrl(base, endpoint, query = {}) {
  const url = new URL(`${base.replace(/\/+$/, '')}${endpoint}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function proxyJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: response.status, data };
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

app.post('/api/login', async (req, res) => {
  const { email, licenseKey } = req.body;
  if (!email || !licenseKey) {
    return res.status(400).json({ success: false, message: 'Email and license key are required.' });
  }

  const licenseUrl = buildUrl(API_BASE_URL, LICENSE_PATH, { key: licenseKey });
  try {
    const { status, data } = await proxyJson(licenseUrl);
    if (status !== 200 || !data || !data.success) {
      return res.status(401).json({ success: false, message: data?.message || 'License validation failed.' });
    }

    const sessionId = randomUUID();
    sessions.set(sessionId, {
      email,
      licenseKey,
      createdAt: Date.now(),
      licenseInfo: data,
    });

    return res.json({ success: true, sessionId, email, licenseInfo: data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to validate license at this time.' });
  }
});

app.post('/api/logout', requireSession, (req, res) => {
  sessions.delete(req.sessionId);
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/session', requireSession, (req, res) => {
  res.json({ success: true, email: req.session.email, licenseInfo: req.session.licenseInfo });
});

app.get('/api/validate-license', requireSession, async (req, res) => {
  const licenseKey = req.session.licenseKey;
  const licenseUrl = buildUrl(API_BASE_URL, LICENSE_PATH, { key: licenseKey });
  try {
    const { status, data } = await proxyJson(licenseUrl);
    return res.status(status).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to validate license.' });
  }
});

app.get('/api/signals', requireSession, async (req, res) => {
  const licenseKey = req.session.licenseKey;
  const signalsUrl = buildUrl(API_BASE_URL, SIGNALS_PATH, { key: licenseKey });
  try {
    const { status, data } = await proxyJson(signalsUrl);
    return res.status(status).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to fetch signals.' });
  }
});

app.get('/api/quotes', requireSession, async (req, res) => {
  if (!QUOTES_PATH) {
    return res.json({ success: true, quotes: [] });
  }

  const quotesUrl = buildUrl(API_BASE_URL, QUOTES_PATH);
  try {
    const { status, data } = await proxyJson(quotesUrl);
    return res.status(status).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to fetch quotes.' });
  }
});

app.post('/api/execute-trade', requireSession, async (req, res) => {
  if (!META_API_BASE_URL) {
    return res.status(500).json({ success: false, message: 'MetaTrader backend is not configured.' });
  }

  const { accountId, symbol, operation, volume, stopLoss, takeProfit, platform } = req.body;
  if (!accountId || !symbol || !operation || !volume) {
    return res.status(400).json({ success: false, message: 'Missing trade parameters.' });
  }

  const params = {
    id: accountId,
    symbol,
    operation,
    volume,
    stoploss: stopLoss,
    takeprofit: takeProfit,
    placedType: 'Manual',
    comment: `${req.session.email || 'mobi-ea'}-trade`,
    platform: platform || 'mt5',
  };

  const tradeUrl = buildUrl(META_API_BASE_URL, '/OrderSend', params);
  const headers = {};
  if (META_API_KEY) headers['Authorization'] = `Bearer ${META_API_KEY}`;

  try {
    const { status, data } = await proxyJson(tradeUrl, { headers });
    return res.status(status).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to execute trade.' });
  }
});

app.get('/api/image-proxy', requireSession, async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).json({ success: false, message: 'Missing image URL.' });

  let parsed;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid image URL.' });
  }

  const allowed = IMAGE_PROXY_ALLOW_LIST.some((host) => parsed.hostname.includes(host));
  if (!allowed) {
    return res.status(403).json({ success: false, message: 'Image host not allowed.' });
  }

  try {
    const response = await fetch(parsed.toString());
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: 'Unable to fetch image.' });
    }
    response.headers.forEach((value, key) => {
      if (key === 'content-length' || key === 'content-type' || key === 'cache-control' || key === 'expires') {
        res.setHeader(key, value);
      }
    });
    res.status(response.status);
    response.body.pipe(res);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to proxy image.' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
