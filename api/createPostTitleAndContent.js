// const { Client } = require("pg");
import pkg from 'pg';
const { Client } = pkg;

import {S3, PutObjectCommand} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
// const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");
// require("dotenv").config();

const client = new Client({
    connectionString: process.env.SUPABASE_CONNECTION_STRING_2,
    ssl: { rejectUnauthorized: false },
});

client.connect();

const s3 = new S3({
    region: "us-west-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export default async function createPostTitleAndContent(req, res) {

    const allowedOrigins = [
        'https://www.boxingnews258.com',
        'http://localhost:3000',
      ];
      
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if(req.method === "POST") {
        try {
    
            const { title, content } = req.body;

            // Insert title into PostgreSQL table
            const insertResult = await client.query(
                "INSERT INTO posts(title) VALUES ($1) RETURNING id",
                [title]
            );
            //Error: error: duplicate key value violates unique constraint "posts_pkey"
            const postId = insertResult.rows[0].id;
    
            // Upload content to S3 bucket
            const articleData = { content, postId };
            const articleParams = {
                Bucket: "boxhub-articles",
                Key: `${postId}.json`,
                ACL: "bucket-owner-full-control",
                Body: JSON.stringify(articleData),
                ContentType: "application/json",
            };
    
            await s3.send(new PutObjectCommand(articleParams));
    
            const articleUrl = `https://boxhub-articles.s3.us-west-1.amazonaws.com/${postId}.json`;
            await client.query("UPDATE posts SET article_url = $1 WHERE id = $2", [
                articleUrl,
                postId,
            ]);
    
            res.status(200).json({ success: true, postId });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ success: false });
        }
    }
};
