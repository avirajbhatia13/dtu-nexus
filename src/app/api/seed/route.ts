import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Post from '@/lib/models/Post';
import Gig from '@/lib/models/Gig';
import LostItem from '@/lib/models/LostItem';

export async function GET() {
    try {
        await dbConnect();

        // 1. Clean existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        await Gig.deleteMany({});
        await LostItem.deleteMany({});

        // 2. Create Users
        const usersData = [
            { email: 'student@dtu.ac.in', name: 'Rohan Verma', role: 'student', department: 'CSE' },
            { email: 'prof@dtu.ac.in', name: 'Dr. S.K. Sharma', role: 'professor', department: 'ECE' },
            { email: 'admin@dtu.ac.in', name: 'DTU Admin', role: 'admin' },
            { email: 'council@dtu.ac.in', name: 'Cultural Council', role: 'club_admin' },
            { email: 'srdtu@dtu.ac.in', name: 'SR DTU Society', role: 'club_admin' },
            { email: 'ieee@dtu.ac.in', name: 'IEEE DTU', role: 'club_admin' },
            { email: 'ananya@dtu.ac.in', name: 'Ananya Gupta', role: 'student', department: 'IT' },
            { email: 'rahul@dtu.ac.in', name: 'Rahul Sharma', role: 'student', department: 'ME' },
            { email: 'priya@dtu.ac.in', name: 'Priya Singh', role: 'student', department: 'BT' },
            { email: 'vikram@dtu.ac.in', name: 'Vikram Malhotra', role: 'student', department: 'EE' },
            { email: 'sneha@dtu.ac.in', name: 'Sneha Reddy', role: 'student', department: 'CE' },
            // Demo account for interviewer walkthrough (admin role = can see/do everything)
            { email: 'demo@dtu.ac.in', name: 'Demo User', role: 'admin', department: 'CSE', password: 'demo1234', isVerified: true },
        ];

        const users = [];
        for (const u of usersData) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                user = await User.create(u);
            }
            users.push(user);
        }

        const [rohan, prof, admin, council, srdtu, ieee, ananya, rahul, priya, vikram, sneha] = users;

        // --- MARKETPLACE GIGS (Will auto-generate posts manually here to link them) ---
        const gigsData = [
            {
                poster: prof._id,
                title: 'Research Assistant for Signal Processing',
                description: 'Looking for a 3rd/4th year student proficient in MATLAB and Python for a research paper on Digital Signal Processing. Time commitment: 10 hrs/week.',
                compensation: 'Paid - ₹5000/mo',
                type: 'faculty_project',
                skillsRequired: ['MATLAB', 'Python'],
                applicants: [{ user: ananya._id, status: 'pending', message: 'I have experience with DSP.' }]
            },
            {
                poster: rohan._id,
                title: 'Frontend Dev for Hack-DTU Team',
                description: 'We are a team of 3 (Backend + AI ML), looking for a strong React/Next.js developer to complete our squad for the upcoming Hackathon.',
                compensation: 'Unpaid',
                type: 'student_collab',
                skillsRequired: ['React', 'CSS'],
                applicants: []
            },
            {
                poster: admin._id,
                title: 'Library Assistant - Part Time',
                description: 'Help manage the digital archive at the Central Library. Flexible hours. Good for students looking for pocket money.',
                compensation: 'Paid - ₹200/hr',
                type: 'student_collab',
                skillsRequired: ['Management', 'Excel'],
                applicants: [{ user: rahul._id, status: 'accepted', message: 'I am free in evenings.' }]
            },
            {
                poster: srdtu._id,
                title: 'Graphic Designer for Sponsorship Brochure',
                description: 'SR DTU needs a creative designer to revamp our sponsorship deck for the upcoming season. Portfolio required.',
                compensation: 'Unpaid',
                type: 'student_collab',
                skillsRequired: ['Photoshop', 'Canva'],
                applicants: []
            },
            {
                poster: ananya._id,
                title: 'Video Editor for YouTube Channel',
                description: 'Starting a tech review channel. Need someone who can edit fast-paced videos. Revenue share model.',
                compensation: 'Paid',
                type: 'student_collab',
                skillsRequired: ['Premiere Pro', 'After Effects'],
                applicants: []
            },
            {
                poster: ieee._id,
                title: 'Event Coordinator for Tech Week',
                description: 'IEEE is looking for volunteers to manage logistics for the upcoming Tech Week. great networking opportunity!',
                compensation: 'Certificate',
                type: 'student_collab',
                skillsRequired: ['Management', 'Communication'],
                applicants: [{ user: sneha._id, status: 'pending' }]
            }
        ];

        for (const g of gigsData) {
            const newGig = await Gig.create(g);
            // Create linked Post
            await Post.create({
                content: `📢 **New Opportunity Alert!**\n\nI just posted a new role: **${g.title}**\n\n${g.description.substring(0, 100)}...\n\nCheck it out in the Marketplace!`,
                author: g.poster,
                type: 'announcement',
                relatedGig: newGig._id,
                isAnonymous: false,
                upvotes: [rohan._id, priya._id] // Random initial upvotes
            });
        }

        // --- UTILITIES ITEMS (Auto-generate linked posts) ---
        const itemsData = [
            {
                finder: ananya._id,
                title: 'Black Sony Headphones',
                description: 'Found these on a bench near Mech Canteen.',
                locationFound: 'Mech Canteen',
                type: 'found',
                contactPhone: '9876543210',
                contactName: 'Ananya',
                status: 'open',
            },
            {
                finder: rohan._id,
                title: 'Blue Generic Wallet',
                description: 'Lost my wallet near the Sports Complex. It contains my ID card and some cash. Please help!',
                locationFound: 'Sports Complex',
                type: 'lost',
                contactPhone: '9998887776',
                contactName: 'Rohan',
                status: 'open',
            },
            {
                finder: priya._id,
                title: 'Silver Water Bottle',
                description: 'Found a Milton water bottle in the startup center waiting area.',
                locationFound: 'Startup Center',
                type: 'found',
                contactPhone: '9123456780',
                contactName: 'Priya',
                status: 'claimed',
            },
            {
                finder: vikram._id,
                title: 'Scientific Calculator fx-991ES',
                description: 'Lost my calculator in Room 302 during the math lecture. It has my initials "VM" scratched on the back.',
                locationFound: 'Room 302',
                type: 'lost',
                contactPhone: '9811223344',
                contactName: 'Vikram',
                status: 'open',

            }
        ];

        for (const i of itemsData) {
            const newItem = await LostItem.create(i);
            const emoji = i.type === 'lost' ? '🛑' : '✅';
            const action = i.type === 'lost' ? 'Lost' : 'Found';
            await Post.create({
                content: `${emoji} **${action} Item Alert!**\n\n${i.title}\nLocation: ${i.locationFound}\n\n${i.description}`,
                author: i.finder,
                type: 'lost_found_item',
                relatedLostItem: newItem._id,
                isAnonymous: false,
                upvotes: [admin._id]
            });
        }

        // --- REGULAR FEED POSTS ---
        const postsData = [
            // OFFICIAL
            {
                author: admin._id,
                content: '📢 IMPORTANT UPDATE: The Annual Cultural Fest "Engifest" has been postponed by two weeks due to unforeseen administrative reasons. New dates: March 15th-17th. Apologies for the inconvenience.',
                type: 'official',
                upvotes: [rohan._id, ananya._id, rahul._id, priya._id, vikram._id, sneha._id],
            },
            {
                author: srdtu._id,
                content: '🏎️ RECRUITMENT ALERT: Team SR DTU is recruiting for the 2024 season! We are looking for passionate engineers for the Chassis, Powertrain, and Marketing departments. \n\nFill the form in bio to apply! Orientation this Friday.',
                type: 'official', // or society
                upvotes: [rohan._id, ananya._id, rahul._id],
            },
            {
                author: council._id,
                content: '🎭 The wait is over! Announcing the star night performance for day 2: It is none other than Sunidhi Chauhan! 🌟\n\nGet your passes from the SAC office starting Monday.',
                type: 'official',
                upvotes: [rohan._id, ananya._id, rahul._id, priya._id, vikram._id, sneha._id, prof._id],
            },

            // ACHIEVEMENTS (Proudly sharing)
            {
                author: vikram._id,
                content: '🏆 Thrilled to share that my team "CodeBreakers" won the 1st Prize at the IIT Delhi Hackathon this weekend! 🥇\n\nWe built a decentralized voting system using Ethereum. Huge thanks to my teammates @Rohan and @Sneha for the sleepless nights!',
                type: 'general',
                upvotes: [rohan._id, ananya._id, admin._id, prof._id, council._id],
            },
            {
                author: sneha._id,
                content: 'Just got my paper accepted at the International Conference on AI & Robotics! 🤖\n\nA big thank you to Dr. S.K. Sharma for his mentorship throughout the project. representing DTU at the global stage feels amazing.',
                type: 'general',
                upvotes: [prof._id, admin._id, vikram._id],
            },
            {
                author: rahul._id,
                content: 'Our departmental cricket team (MECH WARRIORS) just reached the finals of the Inter-Department Tournament! 🏏\n\nCome cheer for us tomorrow at the sports ground, 4 PM vs CSE!',
                type: 'general',
                upvotes: [srdtu._id, priya._id],
            },

            // ANONYMOUS COMPLAINTS / GRIEVANCES
            {
                author: rohan._id,
                content: 'The wifi speed in the library is absolutely pathetic these days. We can\'t even load basic research papers. Admin, please look into this!',
                type: 'grievance',
                isAnonymous: true,
                department: 'Administration',
                upvotes: [ananya._id, rahul._id, priya._id, vikram._id, sneha._id],
            },
            {
                author: ananya._id,
                content: 'Why is the mess food so oily lately? The dal is literally floating in oil. It\'s a health hazard at this point.',
                type: 'grievance',
                isAnonymous: true,
                department: 'Hostel',
                upvotes: [rohan._id, rahul._id, priya._id],
            },
            {
                author: priya._id,
                content: 'The girls\' washroom on the 2nd floor of the SPS block has been locked for 3 days. Can someone open it? It\'s really inconvenient.',
                type: 'grievance',
                isAnonymous: true,
                department: 'Maintenance',
                grievanceStatus: 'resolved',
                upvotes: [sneha._id, ananya._id],
            },
            {
                author: rahul._id,
                content: 'Can we please have more charging points in the canteen? Everyone works there and there are only 2 sockets for 50 people.',
                type: 'general',
                isAnonymous: true,
                upvotes: [rohan._id, vikram._id],
            },

            // GENERAL CHATTER
            {
                author: rohan._id,
                content: 'Has anyone started preparing for the End Sems? I haven\'t even bought the books yet 😭',
                type: 'general',
                upvotes: [rahul._id, vikram._id, ananya._id],
            },
            {
                author: sneha._id,
                content: 'Beautiful sunset from the OAT today. Sometimes I really love this campus. ❤️',
                type: 'general',
                imageUrl: 'placeholder_sunset',
                upvotes: [rohan._id, ananya._id, priya._id, admin._id],
            },
            {
                author: vikram._id,
                content: 'Found a stray puppy near the main gate. It looks hungry. Does anyone have biscuits or milk?',
                type: 'general',
                upvotes: [priya._id, ananya._id, sneha._id],
            },
            {
                author: prof._id,
                content: 'Reminder for ECE 3rd year students: Assignment 2 submission deadline is tonight 11:59 PM. No extensions.',
                type: 'official',
                upvotes: [],
            }
        ];

        for (const p of postsData) {
            await Post.create(p);
        }

        return NextResponse.json({ success: true, message: 'Database seeded with RICH data successfully!' });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
