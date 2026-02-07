import mongoose from 'mongoose';
import ChatRoom from './src/model/chatRoom.Model.js';
import User from './src/model/user.Model.js';
import Booking from './src/model/booking.Model.js';
import Mentor from './src/model/mentor.Model.js';

// Connect to MongoDB (replace with actual connection string if needed, 
// using default based on typical local setup or .env)
const MONGODB_URI = 'mongodb+srv://rajivranjan825410:AscKo2f6Xqgn54SC@cluster0.zt5cw6m.mongodb.net/mentor-app';

const run = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 0. List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('--- Collections ---');
        collections.forEach(c => console.log(c.name));
        console.log('-------------------');

        // 1. List all users and their roles to debug
        const users = await User.find({}, 'name email role');
        console.log('--- All Users ---');
        users.forEach(u => console.log(`${u.name} (${u.email}) - Role: ${u.role} - ID: ${u._id}`));
        console.log('-----------------');

        // 2. Find a mentor user (case insensitive check maybe?)
        const mentorUser = users.find(u => u.role && u.role.toLowerCase() === 'mentor');

        if (!mentorUser) {
            console.log('❌ No mentor user found (checked for "mentor" role).');
            // Try to find a user who has a corresponding Mentor profile
            const allMentors = await Mentor.find({}, 'email');
            if (allMentors.length > 0) {
                console.log('Found Mentor profiles with emails:', allMentors.map(m => m.email));
            }
            process.exit(0);
        }
        console.log(`✅ Found Mentor User: ${mentorUser.name} (${mentorUser._id})`);

        // 2. Find associated Mentor profile
        const mentorProfile = await Mentor.findOne({ email: mentorUser.email });
        if (!mentorProfile) {
            console.log('❌ No Mentor profile found for this user.');
        } else {
            console.log(`✅ Found Mentor Profile: ${mentorProfile._id}`);
        }

        // 3. Inspect all bookings to check for data integrity
        const bookings = await Booking.find({});
        console.log(`--- Inspecting ${bookings.length} Bookings ---`);

        for (const booking of bookings) {
            console.log(`Booking ${booking._id}: MentorID=${booking.mentorId}, UserID=${booking.userId}`);

            const mentor = await Mentor.findById(booking.mentorId);
            if (!mentor) {
                console.log(`  ❌ Mentor NOT FOUND for ID: ${booking.mentorId}`);
                continue;
            }

            const mentorUser = await User.findOne({ email: mentor.email });
            if (!mentorUser) {
                console.log(`  ❌ User NOT FOUND for Mentor Email: ${mentor.email}`);
            } else {
                console.log(`  ✅ Linked to User: ${mentorUser.name} (${mentorUser._id})`);
            }
        }
        // 4. Scan ALL chat rooms for invalid participants (Mentor IDs instead of User IDs)
        const allRooms = await ChatRoom.find({});
        console.log(`--- Scanning ${allRooms.length} Chat Rooms ---`);

        for (const room of allRooms) {
            let isCorrupt = false;
            const participants = room.participants;

            for (const participantId of participants) {
                // Check if this ID belongs to a Mentor doc (it shouldn't)
                const isMentorDoc = await Mentor.findById(participantId);
                if (isMentorDoc) {
                    console.log(`  ❌ Room ${room._id}: Participant ${participantId} is a MENTOR document! (Should be User)`);
                    isCorrupt = true;
                }
            }

            if (isCorrupt) {
                console.log(`  🗑️ Deleting corrupt room ${room._id}...`);
                await ChatRoom.deleteOne({ _id: room._id });
                console.log(`  ✅ Deleted.`);
            }
        }

        console.log('-------------------------------------------');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
