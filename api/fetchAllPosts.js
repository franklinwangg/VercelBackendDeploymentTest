// const { Client } = require("pg");
// require("dotenv").config();

import pkg from 'pg';
const { Client } = pkg;

// import {S3, PutObjectCommand} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
    connectionString: process.env.SUPABASE_CONNECTION_STRING_2,
    ssl: { rejectUnauthorized: false },
});

client.connect();

export default async function fetchAllPosts() {
    try {
        const result = await client.query("SELECT * FROM posts");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Server Error");
    }
};
