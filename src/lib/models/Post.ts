import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

        required: true,
    },
    content: {
        type: String,
        required: [true, 'Post content is required'],
        maxlength: [500, 'Post content cannot exceed 500 characters'],
    },
    imageUrl: {
        type: String, // Optional image
    },
    type: {
        type: String,
        enum: ['general', 'official', 'grievance', 'announcement', 'society', 'lost_found_item'],
        default: 'general',
    },
    relatedGig: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
    },
    relatedLostItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LostItem',
    },
    isAnonymous: {
        type: Boolean,
        default: false,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    grievanceStatus: {
        type: String,
        enum: ['open', 'investigating', 'resolved'],
        default: 'open', // Only applicable if type is 'grievance'
    },
    department: String, // Tag for grievance/official
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    }],
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
