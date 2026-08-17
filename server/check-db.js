const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkUser = async () => {
  try {
    const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(dbUri);
    console.log('DB connected');

    const email = 'admin@admin.com';
    const password = 'admin#18';

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found!');
    } else {
      console.log('User found:', user.email, 'Role:', user.role);
      const isMatch = await user.matchPassword(password);
      console.log('Password match:', isMatch);
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
checkUser();
