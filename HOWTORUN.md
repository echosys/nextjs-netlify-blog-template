TD 
remove The Public Blog (Static) Running on MDX Files (stored in content/posts/).
python script to upload cur ip as note to mongo db
  setup up forward 
add cf pages for contact db 



## Framework

1. Framework: Next.js (perfect for this).
2.
Hosting: Vercel (creators of Next.js) or Netlify. Both have free tiers and support Next.js API routes out of the box. You just push to GitHub, and Vercel builds it with the backend active.
3.
Database: MongoDB Atlas (Cloud).


## Features
- **Tagging**: organizes content by tags
- **Author**: displays author names who write a post
- **Pagination**: limits the number of posts per page
- **CMS**: built with CMS to allow editors modifying content with the quickest way
- **SEO optimized**: built-in metadata like JSON-LD
- **Shortcode**: extends content writing with React component like WordPress shortcodes

## Schema
Create a file named .env.local in the root of your project (this file is usually ignored by git) and add your connection string:
Vercel: When deploying, go to your project settings on Vercel, navigate to Environment Variables, and add MONGODB_URI with the same value.

database name 
    blog_2026
collection name 
    blog_entry 


```
{
  "_id": "ObjectId(...)",
  "title": "String",
  "content": "String",
  "attachment": "String (URL)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### vercel CICD 
Build Command
npm run build
Output Directory
Next.js default
Install Command
npm install

npm run start
npm run dev 

### tools 
jetbrain pycharm plugin gemini code assist stuck on We're experiencing a high volume of usage right now, so we're temporarily at capacity. Try again later.
vscode works fine meantime

npm install -g @google/gemini-cli
