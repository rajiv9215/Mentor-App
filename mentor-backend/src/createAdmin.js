import 'dotenv/config';
import ConnectDB from './config/ConnectDB.js';
import User from './model/user.Model.js';

const adminData = {
    name: "Admin User",
    email: "admin@mentor.com",
    password: "admin123",
    role: "admin"
};

async function createAdmin() {
    try {
        await ConnectDB();
        console.log('✅ Connected to database');

        // Delete existing admin if exists
        const deleted = await User.deleteOne({ email: adminData.email });
        if (deleted.deletedCount > 0) {
            console.log('🗑️  Deleted existing admin user');
        }

        // Create admin user
        const admin = await User.create(adminData);
        console.log('✅ Admin user created successfully!');
        console.log('\n📝 Admin Login Credentials:');
        console.log('   Email: admin@mentor.com');
        console.log('   Password: admin123');
        console.log('   Role:', admin.role);
        console.log('\n💡 You can now login at: http://localhost:1234/auth');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
