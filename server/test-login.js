const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const testLogin = async () => {
  try {
    const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to DB');

    const email = 'google@company.com';
    const password = 'password123';

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found in DB!');
    } else {
      console.log('User found in DB:', user.email);
      console.log('Hashed password in DB:', user.password);
      const isMatch = await user.matchPassword(password);
      console.log('Password match:', isMatch);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to DB or checking user:', error.message);
    process.exit(1);
  }
};
testLogin();
