const path = require('path');
const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

if (!process.env.JWT_SECRET?.trim()) {
  console.error(
    'JWT_SECRET must be set (used to sign admin tokens). Add it in your environment (e.g. Render → Environment).'
  );
  process.exit(1);
}

require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

const DB_STATE = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

app.get('/api/health', (req, res) => {
  const ready = mongoose.connection.readyState;
  const body = {
    ok: ready === 1,
    message: 'Xphere API is running',
    db: {
      state: ready,
      status: DB_STATE[ready] ?? 'unknown',
    },
  };
  if (ready !== 1) {
    return res.status(503).json(body);
  }
  res.json(body);
});

app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const distPath = path.join(__dirname, '..', 'client', 'dist');
const indexHtml = path.join(distPath, 'index.html');

if (fs.existsSync(indexHtml)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(indexHtml, (err) => {
      if (err) next(err);
    });
  });
}

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ message: 'Not found' });
    return;
  }
  res.status(404).type('text/plain').send('Not found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!fs.existsSync(indexHtml)) {
    console.warn(
      'No client build at client/dist — run `npm run build` from the server folder (or build the client) for single-origin UI.'
    );
  }
});
