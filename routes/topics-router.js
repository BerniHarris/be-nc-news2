import express from "express";
import { getTopics } from "../controllers/topics.controller.js";

const topicsRouter = express.Router();

topicsRouter.get("/", getTopics);

export default topicsRouter;
