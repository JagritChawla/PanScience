import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});