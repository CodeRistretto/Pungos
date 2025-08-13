import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    userEmail: { type: String, index: true },
    businessId: { type: String, index: true },
    code: { type: String, unique: true, index: true },
    title: { type: String, default: 'Cupón aprobado' },
    type: { type: String, enum: ['percent', 'amount', 'free_item'], default: 'percent' },
    value: { type: Number, default: 20 }, // -20% demo
    status: { type: String, enum: ['active', 'redeemed', 'expired'], default: 'active', index: true },
    issuedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', CouponSchema);
