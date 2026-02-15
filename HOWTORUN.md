change this to be a blog app 
should I store the mongo db collection string in next js framework and make this repo private? I am using vercel so want to know how to store this. This page should connect to the mongo db for collection blog_entry, put each document as a row where you can click and edit, the document is text only, with the option to add a attachment if possible, if edited and saved, update the record in mongo db as well. Also have the option to create a new blog. Let me know the mongo db schema or options I need to create to make this availble. 

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

### tools 
jetbrain pycharm plugin gemini code assist stuck on We're experiencing a high volume of usage right now, so we're temporarily at capacity. Try again later.
vscode works fine meantime

npm install -g @google/gemini-cli
