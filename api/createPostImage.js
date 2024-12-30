import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import pkg from 'pg';
const { Client } = pkg;
import multer from "multer";

// const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { Client } = require("pg");
// const multer = require("multer");

import dotenv from "dotenv";
dotenv.config();
// require("dotenv").config();

const s3 = new S3({
    region: "us-west-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const client = new Client({
    connectionString: process.env.SUPABASE_CONNECTION_STRING_2,
    ssl: { rejectUnauthorized: false },
});

client.connect();

const imageUpload = multer({ storage: multer.memoryStorage() });


// const imageUpload = multer({ storage: multer.memoryStorage() });

export default async function createPostImage(req, res) {
    imageUpload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ error: 'File upload failed' });
        }

        // Once multer processes the file, continue with your logic
        try {
            const { postId } = req.body;
            const image = req.file; // image is undefined

            // Upload image to S3 bucket
            const params = {
                Bucket: "boxhub-images",
                Key: `${postId}`,
                Body: image.buffer,
                ACL: "bucket-owner-full-control",
                ContentType: image.mimetype,
            };

            await s3.send(new PutObjectCommand(params));

            const imageUrl = `https://boxhub-images.s3.us-west-1.amazonaws.com/${postId}`; // why is postId undefined? cuz req.body is undefined, since it's not being parsed properly
            await client.query("UPDATE posts SET image_url = $1 WHERE id = $2", [
                imageUrl,
                postId,
            ]);

            res.status(200).json({ success: true, imageUrl });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ success: false });
        }

    });
};
