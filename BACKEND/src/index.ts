import express from "express";
import authRouter from "./routes/auth";
import blogRouter from "./routes/blog";
import healthRouter from "./routes/health";
import cors from "cors";
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174","https://blogging-fullstack-app-umnu.vercel.app/"],
  credentials: true,
}));
app.use(express.json());

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static('uploads'));

app.get("/", (_req, res) => {
  res.send("<h2>Welcome to my blog API</h2>");
});



app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/health", healthRouter);

const port = process.env.PORT || 5678;
app.listen(port, () => console.log(`App is live on port ${port}`));
