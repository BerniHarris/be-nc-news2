import express from "express";
import { getApi } from "../controllers/api.controller.js";

const apiRouter = express.Router();

apiRouter.get("/", getApi);

export default apiRouter;
