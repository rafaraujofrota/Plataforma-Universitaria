import { Router } from "express";

import checkAuthentication from "../../shared/middlewares/checkAuthentication";
import { upload } from "../../config/upload";

import CommentsController from "./controllers/CommentsController";
import LikesController from "./controllers/LikesController";

import { validateComment } from "./middlewares/validateComments";

const commentsRouter = Router();

const commentsController = new CommentsController()
const likesController = new LikesController()

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

commentsRouter.post(
    "/like/:commentId",
    checkAuthentication,
    (req, res) => likesController.toggleLikeComment(req, res)
)

export default commentsRouter