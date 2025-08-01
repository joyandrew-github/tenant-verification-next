import mongoose from 'mongoose';

const TenantVerificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  currentAddress: {
    type: String,
    required: [true, 'Please provide current address'],
  },
  employmentStatus: {
    type: String,
    required: [true, 'Please provide employment status'],
  },
  income: {
    type: Number,
    required: [true, 'Please provide income information'],
  },
  identificationDocument: {
    type: String, // Cloudinary URL
    required: false, // Temporarily optional for testing
  },
  proofOfIncome: {
    type: String, // Cloudinary URL
    required: false, // Temporarily optional for testing
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.TenantVerification || mongoose.model('TenantVerification', TenantVerificationSchema);