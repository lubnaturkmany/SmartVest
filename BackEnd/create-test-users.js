// create-test-users.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/user');

async function createUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const hashed = await bcrypt.hash('Test1234', 10);
  
  const users = [
    { username: 'admin', email: 'admin@test.com', role: 'ADMIN', password: hashed },
    { username: 'security', email: 'security@test.com', role: 'SECURITY', password: hashed },
    { username: 'safety', email: 'safety@test.com', role: 'SAFETY', password: hashed },
  ];

  for (const u of users) {
    await User.findOneAndUpdate({ email: u.email }, u, { upsert: true });
    console.log(`✅ ${u.role} - ${u.email}`);
  }

  mongoose.disconnect();
}

createUsers();