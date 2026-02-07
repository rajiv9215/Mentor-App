import 'dotenv/config';
import ConnectDB from './config/ConnectDB.js';
import Mentor from './model/mentor.Model.js';
import User from './model/user.Model.js';

const seedMentors = [
    {
        name: "Rajiv Ranjan",
        email: "rajiv@google.com",
        password: "password123",
        jobTitle: "Digital Marketer",
        company: "Google",
        category: "Digital Marketing",
        bio: "10+ years of experience in digital marketing strategies and growth hacking.",
        skills: ["SEO", "SEM", "Content Marketing", "Analytics"],
        hourlyRate: 100,
        rating: 4.8,
        totalSessions: 150,
        isApproved: true,
        availability: "available"
    },
    {
        name: "Sarah Smith",
        email: "sarah@apple.com",
        password: "password123",
        jobTitle: "UX Designer",
        company: "Apple",
        category: "UI Designer",
        bio: "Passionate about creating intuitive and beautiful user experiences.",
        skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
        hourlyRate: 120,
        rating: 4.9,
        totalSessions: 200,
        isApproved: true,
        availability: "available"
    },
    {
        name: "Mike Johnson",
        email: "mike@netflix.com",
        password: "password123",
        jobTitle: "Software Engineer",
        company: "Netflix",
        category: "Web Developer",
        bio: "Full-stack developer specializing in scalable web applications.",
        skills: ["React", "Node.js", "MongoDB", "AWS"],
        hourlyRate: 150,
        rating: 4.7,
        totalSessions: 180,
        isApproved: true,
        availability: "available"
    },
    {
        name: "Emily Davis",
        email: "emily@spotify.com",
        password: "password123",
        jobTitle: "Product Manager",
        company: "Spotify",
        category: "Management",
        bio: "Experienced product manager with a track record of successful launches.",
        skills: ["Product Strategy", "Agile", "User Stories", "Analytics"],
        hourlyRate: 130,
        rating: 4.6,
        totalSessions: 120,
        isApproved: true,
        availability: "available"
    },
    {
        name: "David Wilson",
        email: "david@amazon.com",
        password: "password123",
        jobTitle: "Data Scientist",
        company: "Amazon",
        category: "Data Science",
        bio: "Data scientist with expertise in machine learning and predictive analytics.",
        skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
        hourlyRate: 140,
        rating: 4.8,
        totalSessions: 160,
        isApproved: true,
        availability: "available"
    },
    {
        name: "Jessica Brown",
        email: "jessica@meta.com",
        password: "password123",
        jobTitle: "Frontend Developer",
        company: "Meta",
        category: "Web Developer",
        bio: "Frontend specialist focused on performance and user experience.",
        skills: ["React", "TypeScript", "CSS", "Performance Optimization"],
        hourlyRate: 135,
        rating: 4.7,
        totalSessions: 140,
        isApproved: true,
        availability: "available"
    },
    {
        name: "Chris Lee",
        email: "chris@microsoft.com",
        password: "password123",
        jobTitle: "Cyber Security Expert",
        company: "Microsoft",
        category: "IT Security",
        bio: "Cybersecurity professional with 15+ years protecting enterprise systems.",
        skills: ["Network Security", "Penetration Testing", "Cloud Security", "Compliance"],
        hourlyRate: 160,
        rating: 4.9,
        totalSessions: 190,
        isApproved: true,
        availability: "available"
    },
    {
        name: "Anna Taylor",
        email: "anna@adobe.com",
        password: "password123",
        jobTitle: "Marketing Head",
        company: "Adobe",
        category: "Digital Marketing",
        bio: "Marketing leader with expertise in brand strategy and digital campaigns.",
        skills: ["Brand Strategy", "Digital Marketing", "Campaign Management", "Analytics"],
        hourlyRate: 145,
        rating: 4.8,
        totalSessions: 175,
        isApproved: true,
        availability: "available"
    }
];

const seedAdminUser = {
    name: "Admin User",
    email: "admin@mentor.com",
    password: "admin123",
    role: "admin"
};

async function seedDatabase() {
    try {
        await ConnectDB();
        console.log('✅ Connected to database');

        // Clear existing data
        await Mentor.deleteMany({});
        await User.deleteMany({ email: 'admin@mentor.com' });
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = await User.create(seedAdminUser);
        console.log('👤 Created admin user:', admin.email);

        // Create mentors
        const createdMentors = await Mentor.insertMany(seedMentors);
        console.log(`✅ Created ${createdMentors.length} mentors`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Login credentials:');
        console.log('   Admin: admin@mentor.com / admin123');
        console.log('   Mentors: Use any mentor email with password: password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
