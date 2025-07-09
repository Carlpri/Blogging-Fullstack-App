import express from "express";
import authRouter from "./routes/auth";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("<h2>Welcome to my blog API</h2>");
});



app.use("/api/auth", authRouter);

const port = process.env.PORT || 5678;
app.listen(port, () => console.log(`App is live on port ${port}`));
