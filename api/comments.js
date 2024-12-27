import pkg from 'pg';
const { Client } = pkg;

import { IncomingForm } from 'formidable'; // for parsing form data
import { promises as fs } from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable body parser for file uploads if needed
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Update with your frontend's origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // End the response for OPTIONS
  } else if (req.method === 'GET') {
    try {
      const { postId } = req.query;

      const client = new Client({
        connectionString: process.env.SUPABASE_CONNECTION_STRING_2,
      });

      await client.connect();
      const result = await client.query('SELECT * FROM comments WHERE post_id = $1', [postId]);
      await client.end();

      res.status(200).json({ rows: result.rows });
    } catch (error) {
      console.error('Error in GET request:', error.message);
      res.status(500).send('Server Error');
    }
  } else if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form Parsing Error:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      try {
        const { post_id, comment_id } = req.query; // Get parameters from query string
        const { author, content, level } = fields; // Get content from form fields
        const client = new Client({ connectionString: process.env.SUPABASE_CONNECTION_STRING_2 });
        await client.connect();

        if (comment_id) {
          const result = await client.query(
            'INSERT INTO comments (post_id, author, content, created_at, level, parent_comment_id) VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *',
            [post_id, author, content, parseInt(level), comment_id]
          );

          res.status(200).json({ rows: result.rows });
        } else {
          const result = await client.query(
            'INSERT INTO comments (post_id, author, content, created_at, level) VALUES ($1, $2, $3, NOW(), $4) RETURNING *',
            [post_id, author, content, level]
          );

          res.status(201).json(result.rows[0]);
        }

        await client.end();
      } catch (error) {
        console.error('Error in POST request:', error.message);
        res.status(500).send('Server Error');
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
