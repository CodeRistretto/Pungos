import mongoose from 'mongoose';

const MetaAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },     // dueño en Pungos
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null },
  platform: { type: String, enum: ['facebook','instagram'], required: true },
  pageId: String,
  pageName: String,
  igBusinessId: String,    // instagram_business_account id
  igUsername: String,
  accessToken: String,     // page token
  longLivedToken: String,  // si lo conviertes
  tokenExpiresAt: Date,
  scopes: [String],
  subscribed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('MetaAccount', MetaAccountSchema);
