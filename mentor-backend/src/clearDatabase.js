import 'dotenv/config';
import ConnectDB from './config/ConnectDB.js';
import Mentor from './model/mentor.Model.js';
import User from './model/user.Model.js';
import MentorApplication from './model/mentorApplication.Model.js';

async function clearDatabase() {
    try {
        await ConnectDB();
        console.log('✅ Connected to database');

        // Clear all mentors
        const deletedMentors = await Mentor.deleteMany({});
        console.log(`🗑️  Deleted ${deletedMentors.deletedCount} mentors`);

        // Clear all users (optional - you might want to keep some)
        const deletedUsers = await User.deleteMany({});
        console.log(`🗑️  Deleted ${deletedUsers.deletedCount} users`);

        // Clear all mentor applications
        const deletedApplications = await MentorApplication.deleteMany({});
        console.log(`🗑️  Deleted ${deletedApplications.deletedCount} mentor applications`);

        console.log('\n🎉 Database cleared successfully!');
        console.log('📝 Your database is now empty and ready for production.');
        console.log('💡 Users can now register and apply to become mentors through the app.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        process.exit(1);
    }
}

clearDatabase();
