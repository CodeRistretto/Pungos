import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: String,
    passwordHash: { type: String, required: true },
    marketingOptIn: { type: Boolean, default: false },
    roles: { type: [String], default: ['user'] }
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;