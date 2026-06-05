import mongoose from 'mongoose';

export interface IAuditLog {
  adminId: mongoose.Types.ObjectId;
  adminEmail: string;
  action: string;
  resource: string;
  ipAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new mongoose.Schema<IAuditLog>(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminEmail: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
