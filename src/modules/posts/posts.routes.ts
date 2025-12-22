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
    postsController.create
)

postsRouter.get(
    "/show",
    checkAuthentication,
    postsController.list
)

postsRouter.get(
    "/",
    checkAuthentication,
    postsController.listAll
)

postsRouter.delete(
    "/:id",
    checkAuthentication, 
    postsController.remove
)

// Comentários

postsRouter.get(
    "/comments/:postId",
    checkAuthentication,
    commentsController.show
)

postsRouter.post(
    "/comments/:postId",
    checkAuthentication,
    upload.single("media"),
    validateComment,
    commentsController.createForPost
)

export default postsRouter