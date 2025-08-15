import mongoose from 'mongoose';

const CouponTemplateSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
  title: { type: String, required: true },                       // ej: "20% OFF", "Café gratis"
  type: { type: String, enum: ['percent','amount','free_item'], required: true },
  value: { type: Number, required: true },                       // ej: 20 (%), 100 (monto), 1 (free item)
  terms: { type: String, default: '' },                          // términos y condiciones
  validDays: { type: Number, default: 7 },                       // días de validez desde emisión
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('CouponTemplate', CouponTemplateSchema);
