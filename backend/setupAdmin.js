require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createDefaultAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Default admin credentials
    const defaultAdmin = {
      name: 'Super Admin',
      email: 'admin@shadicard.com',
      password: 'admin@123',
      role: 'super_admin'
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: defaultAdmin.email });
    if (existingAdmin) {
      existingAdmin.name = defaultAdmin.name;
      existingAdmin.password = defaultAdmin.password;
      existingAdmin.role = defaultAdmin.role;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('⚠️  Default admin already exists!');
      console.log('✅ Password reset successfully');
      console.log('\n📧 Email: admin@shadicard.com');
      console.log('🔑 Password: admin@123');
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin(defaultAdmin);
    await admin.save();

    console.log('\n✅ Default Admin Created Successfully!');
    console.log('\n📧 Email: admin@shadicard.com');
    console.log('🔑 Password: admin@123');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('\n🔐 Login at: http://localhost:5173/admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDefaultAdmin();
