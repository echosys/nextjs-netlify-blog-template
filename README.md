# Next.js MongoDB Blog Template

This project is a modern blog application built with Next.js, Netlify, and MongoDB. It features a simple interface for creating and managing blog posts with file attachments stored directly in the database.

## Design and Architecture

- **New Tab**: Located at `/`, this page allows users to create new blog entries. It includes fields for a title, content, and a file upload button for attachments.
- **Blog Tab**: Located at `/posts`, this page lists all blog entries retrieved from MongoDB. Posts with attachments show a preview (if it's an image) and a download link.
- **Storage**: Attachments (zips, images, or single files) are converted to base64 strings and stored in the `attachment` field of the MongoDB documents.

## Framework & Tools

1. **Framework**: [Next.js](https://nextjs.org/) (using API routes for backend logic).
2. **Hosting**: Optimized for [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).
3. **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud).

## Implementation Details

### Features
- **Dynamic Content**: Blog posts are fetched in real-time from MongoDB.
- **File Uploads**: Supports zip files and single files via base64 encoding.
- **Image Previews**: Automatic preview of image attachments in the blog list.
- **Downloadable Attachments**: One-click download for all stored attachments.
- **Responsive Navigation**: Clean sidebar navigation for switching between creation and viewing.

### MongoDB Schema
The application uses the `blog_2026` database and `blog_entry` collection.

```json
{
  "_id": "ObjectId(...)",
  "title": "String",
  "content": "String",
  "attachment": "String (Base64 Data URL)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Environment Variables
Create a `.env.local` file in the root directory:
```
MONGODB_URI=your_mongodb_connection_string
```
For production, set this variable in your hosting provider's dashboard (Netlify/Vercel).
