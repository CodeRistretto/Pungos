import mongoose from 'mongoose';

const UGCEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null },
  network: { type: String, enum: ['instagram','facebook','tiktok','google','checkin'], required: true },
  postUrl: { type: String, index: true },
  postId: { type: String, index: true, default: null },
  mediaType: { type: String, default: 'story' },
  evidenceUrl: { type: String, default: null },
  status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
  reason: { type: String, default: '' },
  detectedAt: { type: Date, default: Date.now }
}, { timestamps: true });

UGCEventSchema.index({ businessId: 1, postUrl: 1 }, { unique: true, sparse: true });
UGCEventSchema.index({ businessId: 1, postId: 1 }, { unique: true, sparse: true });

export default mongoose.model('UGCEvent', UGCEventSchema);
