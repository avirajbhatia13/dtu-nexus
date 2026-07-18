import fs from 'fs';
import path from 'path';

console.log('--- Seeding Script Start ---');

// 1. Manually Load Environment Variables
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, '');
                process.env[key] = value;
            }
        });
    }
} catch (e) {
    console.warn('Could not load .env.local', e);
}

// 2. Define Data
const USERS = [
    { name: 'Aarav Sharma', email: 'aarav@dtu.ac.in', role: 'student', password: '1234', department: 'CSE', year: '3rd' },
    { name: 'Dr. Vikram Singh', email: 'vikram@dtu.ac.in', role: 'professor', password: '1234', department: 'ECE', bio: 'AI/ML Researcher' },
    { name: 'DTU Cultural Council', email: 'cultural@dtu.ac.in', role: 'club_admin', password: '1234', bio: 'Official Cultural Council' },
    { name: 'SR DTU', email: 'srdtu@dtu.ac.in', role: 'club_admin', password: '1234', bio: 'Student Robinsonics - Robotics Society' },
    { name: 'Dean Student Welfare', email: 'official@dtu.ac.in', role: 'admin', password: '1234', department: 'Admin' },
    { name: 'Priya Verma', email: 'priya@dtu.ac.in', role: 'student', password: '1234', department: 'IT', year: '2nd' },
    { name: 'Rohan Gupta', email: 'rohan@dtu.ac.in', role: 'student', password: '1234', department: 'ME', year: '4th' },
    { name: 'Ananya Singh', email: 'ananya@dtu.ac.in', role: 'student', password: '1234', department: 'SE', year: '3rd' },
];

const GIGS = [
    {
        title: 'Need React Developer for Hackathon',
        description: 'Looking for a frontend dev to join our team for the upcoming HackDTU. Must know Tailwind and Next.js.',
        compensation: 'Unpaid',
        type: 'student_collab',
        skillsRequired: ['React', 'Next.js', 'Tailwind'],
        posterEmail: 'aarav@dtu.ac.in'
    },
    {
        title: 'Research Intern: Computer Vision',
        description: 'Looking for 2 students to work on a traffic monitoring system using YOLOV8. Good grasp of Python required.',
        compensation: 'Paid - ₹5000/mo',
        type: 'faculty_project',
        skillsRequired: ['Python', 'pytorch', 'OpenCV'],
        posterEmail: 'vikram@dtu.ac.in'
    },
    {
        title: 'Video Editor for Engifest Aftermovie',
        description: 'Cultural Council needs a skilled video editor for the fest summary video.',
        compensation: 'Credit Based',
        type: 'part_time',
        skillsRequired: ['Premiere Pro', 'After Effects'],
        posterEmail: 'cultural@dtu.ac.in'
    },
    {
        title: 'SR DTU: Mechanical Design Intern',
        description: 'Join the chassis design team for our next rover. SolidWorks experience preferred.',
        compensation: 'Unpaid',
        type: 'student_collab',
        skillsRequired: ['SolidWorks', 'Ansys'],
        posterEmail: 'srdtu@dtu.ac.in'
    }
];

const LOST_ITEMS = [
    {
        title: 'Lost Blue Water Bottle',
        description: 'Left my blue Milton bottle in the library reading room. Has a sticker of "NASA" on it.',
        locationFound: 'Central Library',
        type: 'lost',
        contactName: 'Priya',
        contactPhone: '9876543210',
        finderEmail: 'priya@dtu.ac.in'
    },
    {
        title: 'Found Casio Calculator',
        description: 'Found a Casio Classwiz calculator in SPS-12. Handed over to guard but posting here.',
        locationFound: 'SPS Hall',
        type: 'found',
        contactName: 'Rohan',
        contactPhone: '9988776655',
        finderEmail: 'rohan@dtu.ac.in'
    }
];

const POSTS = [
    {
        content: '🚨 OFFICIAL NOTICE: Engifest 2025 has been postponed by 2 weeks due to administrative reasons. New dates will be announced shortly. We apologize for the inconvenience.',
        type: 'official',
        authorEmail: 'official@dtu.ac.in',
    },
    {
        content: '🤖 RECRUITMENT ALERT: SR DTU is now hiring for the Software and Electronics subsystem! Come be a part of the team that builds world-class rovers. Auditions start Monday at the mech workshop.',
        type: 'society',
        authorEmail: 'srdtu@dtu.ac.in',
    },
    {
        content: 'So proud of our team "CodeWarriors" for bagging 1st Place at IIT Delhi Hackathon! 🏆 We built an AI tool for centralized healthcare. Hard work pays off! 🚀 #Innovation #HackathonWinners',
        type: 'general',
        authorEmail: 'ananya@dtu.ac.in',
    },
    {
        content: 'Why is the canteen food quality dropping every day? Found a literal stone in my rajma chawal today. This is unacceptable! 😡',
        type: 'grievance',
        department: 'Canteen Committee',
        authorEmail: 'aarav@dtu.ac.in',
        isAnonymous: true,
    },
    {
        content: 'Can someone please tell when the mid-sem datesheet will be out? Stressing out here! 📚',
        type: 'general',
        authorEmail: 'rohan@dtu.ac.in',
    }
];


async function seed() {
    try {
        // Dynamic Import
        const dbConnect = (await import('../src/lib/db')).default;
        const User = (await import('../src/lib/models/User')).default;
        const Post = (await import('../src/lib/models/Post')).default;
        const Gig = (await import('../src/lib/models/Gig')).default;
        const LostItem = (await import('../src/lib/models/LostItem')).default;

        await dbConnect();

        console.log('Cleaning old data...');
        await User.deleteMany({});
        await Post.deleteMany({});
        await Gig.deleteMany({});
        await LostItem.deleteMany({});

        console.log('Creating Users...');
        const userMap = new Map();
        for (const u of USERS) {
            const user = await User.create(u);
            userMap.set(u.email, user._id);
            console.log(`Created: ${u.name} (${u.role})`);
        }

        console.log('Creating Gigs...');
        for (const g of GIGS) {
            const posterId = userMap.get(g.posterEmail);
            if (posterId) {
                const gig = await Gig.create({ ...g, poster: posterId });

                // Auto-create feed post for gig (Deep Integration)
                await Post.create({
                    author: posterId,
                    content: `📢 New Opportunity: ${g.title}\n\n${g.description.substring(0, 100)}...`,
                    type: g.type === 'faculty_project' ? 'official' : 'general',
                    relatedGig: gig._id
                });
            }
        }

        console.log('Creating Lost Items...');
        for (const l of LOST_ITEMS) {
            const finderId = userMap.get(l.finderEmail);
            if (finderId) {
                const item = await LostItem.create({ ...l, finder: finderId });

                // Auto-create feed post for lost item (Deep Integration)
                await Post.create({
                    author: finderId,
                    content: `⚠️ ${l.type.toUpperCase()}: ${l.title}\n\nLocation: ${l.locationFound}`,
                    type: 'lost_found_item',
                    relatedLostItem: item._id
                });
            }
        }

        console.log('Creating General Posts...');
        for (const p of POSTS) {
            const authorId = userMap.get(p.authorEmail);
            if (authorId) {
                // Manually handle anonymous logic if needed, already set in object
                await Post.create({ ...p, author: authorId });
            }
        }

        console.log('--- SEEDING COMPLETE ---');
        console.log('Passwords are all "1234"');
        process.exit(0);

    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
