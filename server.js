// const express = require('express');
// const path = require('path');


// const apiRoutes = require('./api'); // If you have all your API routes here

// const commentRoutes = require("./api/comments");
// const createPostImageRoutes = require("./api/createPostImage");
// const commentPostTitleAndContentRoutes = require("./api/createPostTitleAndContent");
// const fetchAllPostsRoutes = require("./api/fetchAllPosts");
// const postsRoutes = require("./api/posts");
// const usersRoutes = require("./api/users");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Serve static files from the "build" directory
// app.use(express.static(path.join(__dirname, 'frontend/build')));

// // Add API routes
// app.use('/api/comments', commentRoutes); // Proxy all API requests to the API routes you have
// app.use('/api/createPostImage', createPostImageRoutes); // Proxy all API requests to the API routes you have
// app.use('/api/commentPostTitleAndContentRoutes', commentPostTitleAndContentRoutes); // Proxy all API requests to the API routes you have
// app.use('/api/fetchAllPostsRoutes', fetchAllPostsRoutes); // Proxy all API requests to the API routes you have
// app.use('/api/posts', postsRoutes); // Proxy all API requests to the API routes you have
// app.use('/api/users', usersRoutes); // Proxy all API requests to the API routes you have

// // Catch-all to serve the React frontend for non-API routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


// const express = require('express');
// const path = require('path');
import express from "express";
import path from "path";
import multer from "multer";

import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageUpload = multer({ storage: multer.memoryStorage() });


// API routes
import commentRoutes from './api/comments.js';
import createPostImageRoutes from './api/createPostImage.js';
import createPostTitleAndContentRoutes from './api/createPostTitleAndContent.js';
import fetchAllPostsRoutes from './api/fetchAllPosts.js';
import postsRoutes from './api/posts.js';
import usersRoutes from './api/users.js';

app.use(express.json());

// Use the API routes with the appropriate paths
app.use('/api/comments', commentRoutes);
// app.use(imageUpload);

app.use('/api/createPostImage', imageUpload.single('image'), createPostImageRoutes); // ???


// app.use('/api/createPostImage', createPostImageRoutes);
app.use('/api/createPostTitleAndContent', createPostTitleAndContentRoutes);
app.use('/api/fetchAllPosts', fetchAllPostsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);


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
