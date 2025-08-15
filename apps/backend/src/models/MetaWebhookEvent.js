import mongoose from 'mongoose';

const MetaWebhookEventSchema = new mongoose.Schema({
  object: String,
  raw: Object,
  type: String,
  receivedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('MetaWebhookEvent', MetaWebhookEventSchema);
