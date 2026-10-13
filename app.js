import express from "express";
import cors from "cors";
import apiRouter from "./routes/api-router.js";
import topicsRouter from "./routes/topics-router.js";
import articlesRouter from "./routes/articles-router.js";
import usersRouter from "./routes/users-router.js";

import {
  customError,
  error404,
  error500,
  psqlError,
} from "./helpers/errors/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);

app.all("/*invalid", error404);

app.use(psqlError);
app.use(customError);
app.use(error500);

export default app;
