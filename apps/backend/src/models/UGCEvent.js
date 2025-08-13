import mongoose from 'mongoose';

const UGCEventSchema = new mongoose.Schema(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String },
    },
    businessId: { type: String, index: true },
    network: { type: String, enum: ['instagram', 'tiktok', 'google'], required: true, index: true },
    postUrl: { type: String },
    postId: { type: String, index: true },
    mediaType: { type: String, default: 'image' },
    evidenceUrl: { type: String }, // screenshot / link a media
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    reason: { type: String }, // motivo de rechazo
    detectedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('UGCEvent', UGCEventSchema);
