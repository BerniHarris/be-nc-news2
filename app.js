import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-router.js";
import topicsRouter from "./routes/topics-router.js";
import articlesRouter from "./routes/articles-router.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);

export default app;
