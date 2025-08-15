import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';
import authRouter from './src/routes/auth.routes.js';
import mongoose from 'mongoose';
import ugcRoutes from './src/routes/ugc.routes.js';
import metaOAuth from './src/routes/meta.oauth.routes.js';
import metaOAuthCallback from './src/routes/meta.oauth.callback.js';
import webhooksMeta from './src/routes/webhooks.meta.routes.js';


const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.get("/", (req, res) => {
  res.send("Pungos API is running");
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// server.js
function rawBodySaver(req, res, buf) {
  if (buf && buf.length) req.rawBody = buf;
}
app.use(express.json({ verify: rawBodySaver }));

// meta
app.use('/api/meta/oauth', metaOAuth);
app.use('/api/meta/oauth', metaOAuthCallback);
app.use('/api/webhooks/meta', webhooksMeta);
app.use('/api/meta/oauth/callback', metaOAuthCallback);

// Rutas
app.use('/api/ugc', ugcRoutes);
import campaignsRoutes from './src/routes/campaigns.routes.js';
// ...
app.use('/api/campaigns', campaignsRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno' });
});

const PORT = process.env.PORT || 4000;
await connectDB();
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));