require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const { authRouter } = require('./routes/auth');
const { usersRouter } = require('./routes/users');
const { templatesRouter } = require('./routes/templates');
const { utilsRouter } = require('./routes/utils');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'WhatsX_Advanced', env: process.env.NODE_ENV || 'development' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/utils', utilsRouter);

// Example scheduled job (hourly): rotate a trivial log/heartbeat
cron.schedule('0 * * * *', () => {
  // In prototype, just log. In production, place cleanup or aggregation jobs here.
  // eslint-disable-next-line no-console
  console.log('[cron] hourly heartbeat', new Date().toISOString());
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});

