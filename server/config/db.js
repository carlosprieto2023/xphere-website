const mongoose = require('mongoose');
const {
  getMongoUriFromEnv,
  assertValidMongoUri,
} = require('../utils/mongoUri');

const uri = getMongoUriFromEnv();

if (!assertValidMongoUri(uri)) {
  console.error(
    'DATABASE_URL or MONGODB_URI must be a MongoDB connection string (mongodb:// or mongodb+srv://).'
  );
  console.error(
    'In Render → Environment, set the value to the URI only (no variable name, no wrapping quotes). Example: mongodb+srv://user:pass@cluster.../dbname'
  );
  process.exit(1);
}

try {
  const p = mongoose.connect(uri);
  if (p && typeof p.catch === 'function') {
    p.catch((err) => {
      console.error('MongoDB connection failed:', err.message);
      process.exit(1);
    });
  }
} catch (err) {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
}

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`Connected to MongoDB: ${db.name}`);
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
