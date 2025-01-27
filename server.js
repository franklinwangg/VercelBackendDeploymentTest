// import express from "express";
// import path from "path";
// import multer from "multer";
// import cors from 'cors';

// // API routes
// import commentRoutes from './api/comments.js';
// import createPostImageRoutes from './api/createPostImage.js';
// import createPostTitleAndContentRoutes from './api/createPostTitleAndContent.js';
// import fetchAllPostsRoutes from './api/fetchAllPosts.js';
// import postsRoutes from './api/posts.js';
// import usersRoutes from './api/users.js';

// const app = express();

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'], // Adjust as needed
// };

// app.use(cors(corsOptions));

// const imageUpload = multer({ storage: multer.memoryStorage() });
// app.use('/api/createPostImage', imageUpload.single('image'), createPostImageRoutes); // ???

// app.use('/api/comments', express.json(), commentRoutes);
// app.use('/api/createPostTitleAndContent', express.json(), createPostTitleAndContentRoutes);
// app.use('/api/fetchAllPosts', express.json(), fetchAllPostsRoutes);
// app.use('/api/posts', express.json(), postsRoutes);
// app.use('/api/users', express.json(), usersRoutes);

//     // const clientURL = process.env.REACT_APP_API_URL_CLIENT;

//     // useEffect(() => {
//     //     // fetch("https://vercel-backend-deployment-test-d24q.vercel.app/api/posts")
//     //     fetch(`${clientURL}/api/posts`)
//     //         // "https://vercel-backend-deployment-test-d24q.vercel.app/api/posts")
//     //         .then((response) => {
//     //             return response.json();
//     //         })


// // Server setup
// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const express = require("express");
const multer = require("multer");
const cors = require("cors");

// API routes
const commentRoutes = require('./api/comments.js');
const createPostImageRoutes = require('./api/createPostImage.js');
const createPostTitleAndContentRoutes = require('./api/createPostTitleAndContent.js');
const fetchAllPostsRoutes = require('./api/fetchAllPosts.js');
const postsRoutes = require('./api/posts.js');
const usersRoutes = require('./api/users.js');

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Adjust as needed
};

app.use(cors(corsOptions));

const imageUpload = multer({ storage: multer.memoryStorage() });
// app.use('/api/createPostImage', imageUpload.single('image'), createPostImageRoutes);
app.use('/api/createPostImage', createPostImageRoutes);

app.use('/api/comments', express.json(), commentRoutes);
app.use('/api/createPostTitleAndContent', express.json(), createPostTitleAndContentRoutes);
app.use('/api/fetchAllPosts', express.json(), fetchAllPostsRoutes);
app.use('/api/posts', express.json(), postsRoutes);
app.use('/api/users', express.json(), usersRoutes);

// Server setup
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
