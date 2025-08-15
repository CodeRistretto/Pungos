import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  code: { type: String, required: true, unique: true, index: true },
  qrPayload: { type: String, required: true },
  status: { type: String, enum: ['active','redeemed','expired'], default: 'active', index: true },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null, index: true },
  redeemedAt: { type: Date, default: null },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null }
}, { timestamps: true });

export default mongoose.model('Coupon', CouponSchema);
