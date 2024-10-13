import express from 'express';
import dotenv from 'dotenv';
import web from "./routes/web.js"
//import connectDB from './database/connection.js';
import connectDB from './database/db.js'

dotenv.config();

const app = express();
app.use(express.json());

// Connect to the MongoDB database
connectDB();  // Ensure this is called to initiate the connection

const port = process.env.PORT || 5000;  // Fallback to port 5000 if not defined

// Routes

app.use("/api/",web);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.get('/about', (req, res) => {
  res.send('<h1>About Page</h1>');
});

// Start server
app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
  
});
