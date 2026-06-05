import mongoose, { Schema } from 'mongoose';

const SupportTicketSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    userName: { type: String, default: 'Anonymous' },
    userEmail: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open', index: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    category: { type: String, enum: ['General', 'Billing', 'Technical', 'Workout', 'Diet', 'Account', 'Other'], default: 'General' },
    assignedTo: { type: String, default: '' },
    resolution: { type: String, default: '' },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);
