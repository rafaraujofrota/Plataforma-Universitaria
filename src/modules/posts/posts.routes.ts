import { Router } from "express";

import checkAuthentication from "../../shared/middlewares/checkAuthentication";
import { upload } from "../../config/upload";

import PostsController from "./controllers/PostsController";
import CommentsController from "./controllers/CommentsController";

import { validatePost } from "./middlewares/validatePosts";
import { validateComment } from "./middlewares/validateComments";

const postsRouter = Router();

const postsController = new PostsController()
const commentsController = new CommentsController()

postsRouter.post(
    "/",
    checkAuthentication,
    upload.single("media"),
    validatePost,
    (req, res) => postsController.create(req, res)
)

postsRouter.get(
    "/show",
    checkAuthentication,
    (req, res) => postsController.list(req, res)
)

postsRouter.get(
    "/",
    checkAuthentication,
    (req, res) => postsController.listAll(req, res)
)

postsRouter.delete(
    "/:id",
    checkAuthentication, 
    (req, res) => postsController.remove(req, res)
)

// Comentários

postsRouter.get(
    "/comments/:postId",
    checkAuthentication,
    (req, res) => commentsController.show(req, res)
)

postsRouter.post(
    "/comments/:postId",
    checkAuthentication,
    upload.single("media"),
    validateComment,
    (req, res) => commentsController.createForPost(req, res)
)

export default postsRouter