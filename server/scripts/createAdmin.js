require('dotenv').config();
require('../config/db');

const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const plainPassword = process.env.ADMIN_PASSWORD;

    const existingAdmins = await Admin.countDocuments();

    if (existingAdmins > 0) {
      console.log('Admin already exists. Seed blocked.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin created successfully:', admin.email);
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
