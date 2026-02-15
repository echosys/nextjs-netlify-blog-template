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

### User Authentication
The application includes a premium login system:
- **API**: `/api/login` verifies credentials against the `blog_login` collection.
- **Login Page**: Accessible via `/login`.
- **Protection**: Creating, editing, and deleting blogs are restricted to authenticated users.

### Tag Management & Filtering
An optimized tag system is implemented for high-performance filtering:
- **Global Tag List**: Unique tags are cached in the `blog_login` collection whenever a blog is created or updated. This avoids expensive scans of the entire blog collection.
- **Sidebar Filtering**: The blog listing page (`/posts`) features a sidebar with a tag dropdown and quick-filter buttons.
- **API Support**: The `/api/blogs` endpoint supports a `tag` query parameter for filtered, paginated results (15 per page).

## MongoDB Schema

### Blog Entry (`blog_entry`)
```json
{
  "_id": "ObjectId",
  "title": "String",
  "content": "String",
  "tags": ["String"],
  "attachment": "Base64 String (Data URL)",
  "attachmentName": "String (Original Filename)",
  "createdAt": "Date",
  "updatedAt": "Date (Optional)"
}
```

### Login & Global Tags (`blog_login`)
```json
{
  "_id": "ObjectId",
  "login": "String",
  "pw": "String",
  "tags": ["String"] (Used to cache unique tags across all posts)
}
```

### Environment Variables
Create a `.env.local` file in the root directory:
```
MONGODB_URI=your_mongodb_connection_string
```
For production, set this variable in your hosting provider's dashboard (Netlify/Vercel).
