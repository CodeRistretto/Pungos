import mongoose from 'mongoose';

const MetaWebhookEventSchema = new mongoose.Schema({
  object: String,
  type: String,
  raw: Object,
  receivedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('MetaWebhookEvent', MetaWebhookEventSchema);
