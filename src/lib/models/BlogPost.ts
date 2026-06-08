import mongoose, { Schema } from 'mongoose';

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, default: '' },
    summary: { type: String, required: true },
    author: { type: String, default: 'LeanVerse AI Team' },
    category: { type: String, required: true, index: true },
    tags: { type: [String], default: [], index: true },
    coverImage: { type: String, default: '' },
    // Status & scheduling
    status: { type: String, enum: ['draft', 'scheduled', 'published'], default: 'draft', index: true },
    scheduledAt: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    // SEO
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    keywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: '' },
    // Analytics
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    avgTimeOnPage: { type: Number, default: 0 }, // seconds
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
