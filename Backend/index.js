import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js";


dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes)

app.use("/api/tasks", taskRoutes);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});