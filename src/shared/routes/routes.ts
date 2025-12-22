import { Router } from "express";

import usersRouter from "../../modules/users/users.routes";
import postsRouter from "../../modules/posts/posts.routes";
import commentsRouter from "../../modules/posts/comments.routes";

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/posts', postsRouter)
routes.use('/comments', commentsRouter)

export default routes