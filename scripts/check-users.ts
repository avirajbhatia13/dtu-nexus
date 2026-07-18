import fs from 'fs';
import path from 'path';

console.log('--- Script Start ---');
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    // console.log('Loading .env.local from:', envPath);

    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        const lines = envConfig.split('\n');

        lines.forEach(line => {
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

async function cleanUsers() {
    try {
        const dbConnect = (await import('../src/lib/db')).default;
        const User = (await import('../src/lib/models/User')).default;

        await dbConnect();

        // Delete users where password string is "undefined" or missing
        // Note: Due to schema, it might be saved as literal "undefined" or null
        const res = await User.deleteMany({
            $or: [
                { password: { $exists: false } },
                { password: { $eq: "undefined" } } // In case it stringified
            ]
        });

        console.log(`Deleted ${res.deletedCount} invalid users.`);

        const users = await User.find({}).select('+password');
        console.log('--- REMAINING USERS ---');
        users.forEach(u => {
            console.log(`Email: "${u.email}" | Password: "${u.password}"`);
        });
        console.log('-----------------------');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanUsers();
