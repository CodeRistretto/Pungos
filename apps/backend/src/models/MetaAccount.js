import mongoose from 'mongoose';

const MetaAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },     // quién conectó
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null },
  platform: { type: String, enum: ['facebook','instagram'], required: true },
  pageId: String,                        // id de la página de FB
  pageName: String,
  igBusinessId: String,                  // instagram_business_account id
  accessToken: String,                   // token corto o de página
  longLivedToken: String,                // si lo conviertes
  tokenExpiresAt: Date,
  scopes: [String],
  subscribed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('MetaAccount', MetaAccountSchema);
