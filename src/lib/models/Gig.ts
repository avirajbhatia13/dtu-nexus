import mongoose from 'mongoose';

const GigSchema = new mongoose.Schema({
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Gig title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    compensation: {
        type: String,
        default: 'Unpaid', // e.g., 'Paid - ₹5000', 'Unpaid', 'Credit Based'
    },
    skillsRequired: [String],
    type: {
        type: String,
        enum: ['faculty_project', 'student_collab', 'part_time'],
        default: 'student_collab',
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    applicants: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        message: String,
        resume: String,
        branch: String,
        semester: String,
    }],
}, { timestamps: true });

export default mongoose.models.Gig || mongoose.model('Gig', GigSchema);
