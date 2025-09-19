import express from 'express';
import connectDB from './lib/db.js';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/tokens', tokenRoutes);

app.get('/', (req, res) => {
    res.send("Connected to Db successfully");
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectDB();
});