import express from "express";
import path from "path";
import multer from "multer";

import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// API routes
import commentRoutes from './api/comments.js';
import createPostImageRoutes from './api/createPostImage.js';
import createPostTitleAndContentRoutes from './api/createPostTitleAndContent.js';
import fetchAllPostsRoutes from './api/fetchAllPosts.js';
import postsRoutes from './api/posts.js';
import usersRoutes from './api/users.js';

const imageUpload = multer({ storage: multer.memoryStorage() });
app.use('/api/createPostImage', imageUpload.single('image'), createPostImageRoutes); // ???

app.use('/api/comments', express.json(), commentRoutes);
app.use('/api/createPostTitleAndContent', express.json(), createPostTitleAndContentRoutes);
app.use('/api/fetchAllPosts', express.json(), fetchAllPostsRoutes);
app.use('/api/posts', express.json(), postsRoutes);
app.use('/api/users', express.json(), usersRoutes);


// Get the current directory path

// Now you can use __dirname as you would in CommonJS
app.use(express.static(path.join(__dirname, 'frontend', 'build')));


// Catch-all route to serve the frontend for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});


// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
