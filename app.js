import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-router.js";
import topicsRouter from "./routes/topics-router.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);

export default app;
