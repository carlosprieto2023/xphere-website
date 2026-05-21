/**
 * List admin emails in the database (no passwords). Use to confirm DATABASE_URL
 * matches the app you log into (e.g. same URI as Render).
 *
 *   cd server && npm run admin:list
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const {
  getMongoUriFromEnv,
  assertValidMongoUri,
} = require('../utils/mongoUri');

const uri = getMongoUriFromEnv();
if (!assertValidMongoUri(uri)) {
  console.error('Set DATABASE_URL or MONGODB_URI.');
  process.exit(1);
}

async function run() {
  await mongoose.connect(uri);
  const admins = await Admin.find({}, 'email role createdAt').lean();
  if (admins.length === 0) {
    console.log('No admin accounts in this database.');
  } else {
    console.log(`Found ${admins.length} admin(s):`);
    admins.forEach((a) => {
      console.log(`  - ${a.email} (${a.role})`);
    });
  }
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
