const mongoose = require('mongoose');

/**
 * @openapi
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         vehicleNumber: { type: string, example: "KA-01-MG-1234" }
 *         ownerName: { type: string, example: "John Doe" }
 *         ownerPhoneNumber: { type: string, example: "+1234567890" }
 *         plateImage: { type: string, example: "/uploads/plate_1717643920.jpg" }
 *         checkInTime: { type: string, format: date-time }
 *         checkOutTime: { type: string, format: date-time, nullable: true }
 *         addedBy: { type: string, description: "ID of user who registered the vehicle" }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 */
const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, uppercase: true, trim: true, index: true },
    ownerName: { type: String, required: true, trim: true },
    ownerPhoneNumber: { type: String, required: true, trim: true },
    plateImage: { type: String, required: true, trim: true },
    checkInTime: { type: Date, required: true, default: Date.now },
    checkOutTime: { type: Date, default: null },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

vehicleSchema.method('toJSON', function toJSON() {
  return this.toObject({ versionKey: false });
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
