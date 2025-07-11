import express from "express";
import authRouter from "./routes/auth";
import blogRouter from "./routes/blog";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("<h2>Welcome to my blog API</h2>");
});



app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);

const port = process.env.PORT || 5678;
app.listen(port, () => console.log(`App is live on port ${port}`));
