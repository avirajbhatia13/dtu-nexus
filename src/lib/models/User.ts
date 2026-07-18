import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email for this user.'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide a name for this user.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    role: {
        type: String,
        enum: ['student', 'professor', 'admin', 'club_admin'],
        default: 'student',
    },
    password: {
        type: String,
        // Not required for now to support existing users / magic link auth
        select: false, // Don't return password by default
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    // Additional fields can be added here (e.g., profilePic, department, etc.)
    profilePic: String,
    department: String,
    age: Number,
    course: String,
    semester: String,
    branch: String,
    bio: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);


