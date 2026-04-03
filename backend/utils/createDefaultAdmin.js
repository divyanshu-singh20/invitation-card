const Admin = require('../models/Admin');

const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@shadicard.com';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('⚠️ Default admin already exists');
      return;
    }

    // Create default admin
    await Admin.create({
      name: 'Super Admin',
      email: adminEmail,      // ✅ FIXED
      password: 'admin@123',
      role: 'super_admin'
    });

    console.log('✅ Default admin created');
    console.log('📧 Email: admin@shadicard.com');
    console.log('🔑 Password: admin@123');

  } catch (error) {
    console.error('❌ Admin seed error:', error.message);
  }
};

module.exports = createDefaultAdmin;
