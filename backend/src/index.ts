import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { servicesRouter } from './routes/services';
import { workshopsRouter } from './routes/workshops';
import { bookingsRouter } from './routes/bookings';
import { paymentsRouter } from './routes/payments';
import { leadsRouter } from './routes/leads';
import { adminBootstrapRouter } from './routes/adminBootstrap';
import { settingsRouter } from './routes/settings';
import { uploadAvatarRouter } from './routes/uploadAvatar';
import { uploadWorkshopImageRouter } from './routes/uploadWorkshopImage';

dotenv.config();

const app = express();
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
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/services', servicesRouter);
app.use('/api/workshops', workshopsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/admin/bootstrap-admin', adminBootstrapRouter);
app.use('/api/admin/settings', settingsRouter);
app.use('/api/admin/upload-avatar', uploadAvatarRouter);
app.use('/api/admin/upload-workshop-image', uploadWorkshopImageRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
