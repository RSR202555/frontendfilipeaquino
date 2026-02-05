import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { servicesRouter } from './routes/services';
import { workshopsRouter } from './routes/workshops';
import { bookingsRouter } from './routes/bookings';
import { paymentsRouter } from './routes/payments';
import { leadsRouter } from './routes/leads';
import { plansRouter } from './routes/plans';
import { availabilitiesRouter } from './routes/availabilities';
import { settingsRouter } from './routes/settings';
import { uploadAvatarRouter } from './routes/uploadAvatar';
import { uploadWorkshopImageRouter } from './routes/uploadWorkshopImage';
import { authMiddleware } from './middlewares/authMiddleware';

dotenv.config();

const app = express();

// Proteção básica contra sniffing de MIME e XSS simples
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
const allowedOrigins = allowedOriginsEnv
  ? allowedOriginsEnv.split(',').map((o) => o.trim()).filter(Boolean)
  : undefined;

app.use(
  cors({
    origin: allowedOrigins || true,
    credentials: true,
  })
);
app.use(express.json());

// arquivos estáticos para uploads (ex: avatars)
// OBS: Em produção, o 'express.static' deve ser configurado com cuidado ou 
// os arquivos devem ser servidos por um CDN/Nginx com as devidas restrições.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Agendamentos backend running' });
});

// Rotas Públicas
app.use('/api/services', servicesRouter);
app.use('/api/plans', plansRouter);
app.use('/api/availabilities', availabilitiesRouter);
app.use('/api/workshops', workshopsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/leads', leadsRouter);

// Rotas Protegidas (Exigem ADMIN_API_KEY)
app.use('/api/admin/settings', authMiddleware, settingsRouter);
app.use('/api/admin/upload-avatar', authMiddleware, uploadAvatarRouter);
app.use('/api/admin/upload-workshop-image', authMiddleware, uploadWorkshopImageRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

