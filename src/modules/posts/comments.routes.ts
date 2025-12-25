import { Router } from "express";

import checkAuthentication from "../../shared/middlewares/checkAuthentication";
import { upload } from "../../config/upload";

import CommentsController from "./controllers/CommentsController";

import { validateComment } from "./middlewares/validateComments";

const commentsRouter = Router();

const commentsController = new CommentsController()

commentsRouter.post(
    "/:commentId",
    checkAuthentication,
    upload.single("media"),
    validateComment,
    (req, res) => commentsController.createReply(req, res)
)

commentsRouter.delete(
    "/:commentId",
    checkAuthentication,
    (req, res) => commentsController.remove(req, res)
)

export default commentsRouter