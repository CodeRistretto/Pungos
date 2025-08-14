import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  marketingOptIn: { type: Boolean, default: false },
  referralSource: {
    type: String,
    enum: ['instagram', 'tiktok', 'google', 'amigo', 'otros'],
    default: 'otros'
  },
  roles: { type: [String], default: ['user'] },
  createdAt: { type: Date, default: Date.now },

  // reset password
  resetToken: { type: String, default: null },
  resetTokenExp: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);