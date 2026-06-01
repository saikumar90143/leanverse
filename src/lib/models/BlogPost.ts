import mongoose, { Schema } from 'mongoose';

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    author: { type: String, default: 'LeanVerse AI Team' },
    category: { type: String, required: true, index: true },
    tags: { type: [String], default: [], index: true },
    coverImage: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
