import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogEntry extends Document {
  title: string;
  content: string;
  attachment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogEntrySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this blog entry.'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the content for this blog entry.'],
    },
    attachment: {
      type: String, // URL to the attachment
      required: false,
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Check if the model is already compiled to prevent OverwriteModelError
const BlogEntry: Model<IBlogEntry> =
  mongoose.models.BlogEntry || mongoose.model<IBlogEntry>('BlogEntry', BlogEntrySchema, 'blog_entry');

export default BlogEntry;