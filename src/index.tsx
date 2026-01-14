import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';
import apiRoutes from './routes/api';
import pageRoutes from './routes/pages';

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('/api/*', cors());

// Mount Routes
app.route('/api', apiRoutes);
app.route('/', pageRoutes);

export default app;
