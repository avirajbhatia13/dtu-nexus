import mongoose from 'mongoose';

const LostItemSchema = new mongoose.Schema({
    finder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { type: String, required: true },
    description: String,
    locationFound: String,
    imageUrl: String,
    contactPhone: String,
    contactName: String,
    type: {
        type: String,
        enum: ['lost', 'found'],
        default: 'found',
    },
    status: {
        type: String,
        enum: ['open', 'claimed', 'resolved'],
        default: 'open',
    },
}, { timestamps: true });

export default mongoose.models.LostItem || mongoose.model('LostItem', LostItemSchema);
