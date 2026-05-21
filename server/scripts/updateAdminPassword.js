/**
 * Reset an existing admin password.
 *
 * Usage (from server/):
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='new-secret' node scripts/updateAdminPassword.js
 *
 * Or add ADMIN_EMAIL / ADMIN_PASSWORD to server/.env temporarily, then run the same command.
 */
require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env'),
});
const mongoose = require('mongoose');

const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const {
  getMongoUriFromEnv,
  assertValidMongoUri,
} = require('../utils/mongoUri');

const uri = getMongoUriFromEnv();
if (!assertValidMongoUri(uri)) {
  console.error('Set DATABASE_URL or MONGODB_URI (same as the app).');
  process.exit(1);
}

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
/* Trim env value — trailing spaces/newlines in .env break login */
const plainPassword = String(process.env.ADMIN_PASSWORD || '')
  .replace(/^\uFEFF/, '')
  .trim();

async function run() {
  if (!email || !plainPassword) {
    console.error(
      'Set ADMIN_EMAIL and ADMIN_PASSWORD (the new password). Example:\n' +
        "  ADMIN_EMAIL=you@site.com ADMIN_PASSWORD='NewPass' npm run admin:password"
    );
    process.exit(1);
  }

  await mongoose.connect(uri);

  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.error(`No admin found with email: ${email}`);
    console.error(
      'Run `npm run admin:list` to see which emails exist. Use the same DATABASE_URL as production (Render) if you deploy there.'
    );
    process.exit(1);
  }

  admin.password = await bcrypt.hash(plainPassword, 10);
  await admin.save();

  const fresh = await Admin.findById(admin._id);
  const verify = await bcrypt.compare(plainPassword, fresh.password);
  if (!verify) {
    console.error(
      'Password did not verify after save; check database connection.'
    );
    process.exit(1);
  }

  console.log('Password updated for:', admin.email);
  console.log(
    'Log in with that email and the new password. If login still fails, you are probably hitting a different database than this script (compare DATABASE_URL to Render).'
  );
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
