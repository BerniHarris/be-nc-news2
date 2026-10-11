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

app.use((err, req, res, next) => {
  if (err.status && err.message) {
    return res.status(err.status).send({ message: err.message });
  }

  if (err.code === "22P02") {
    return res.status(400).send({ message: "Invalid id" });
  }

  return res.status(500).send({ message: "Internal Server Error" });
});

export default app;
