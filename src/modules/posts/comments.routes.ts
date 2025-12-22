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
    commentsController.createReply
)

commentsRouter.delete(
    "/:commentId",
    checkAuthentication,
    commentsController.remove
)

export default commentsRouter