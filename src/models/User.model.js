const mongoose = require('mongoose');

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         email: { type: string, format: email }
 *         role: { type: string, enum: [admin, user, staff] }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user', 'staff'], default: 'user' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.method('toJSON', function toJSON() {
  const obj = this.toObject({ versionKey: false });
  delete obj.passwordHash;
  return obj;
});

module.exports = mongoose.model('User', userSchema);
