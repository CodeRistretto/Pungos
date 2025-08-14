import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  businessId: { type: String, default: 'demo-biz', index: true },
  name: { type: String, required: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  status: { type: String, enum: ['active', 'paused', 'finished'], default: 'active', index: true },
  createdBy: { type: String, default: 'owner' },
}, { timestamps: true });

export default mongoose.model('Campaign', CampaignSchema);
