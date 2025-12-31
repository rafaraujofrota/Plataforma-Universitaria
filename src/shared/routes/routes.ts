import { Router } from "express";

import usersRouter from "../../modules/users/users.routes";
import postsRouter from "../../modules/posts/posts.routes";
import commentsRouter from "../../modules/posts/comments.routes";
import eventsRouter from "../../modules/events/events.routes";
import reportsRouter from "../../modules/reports/reports.routes";

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/posts', postsRouter)
routes.use('/comments', commentsRouter)
routes.use('/events', eventsRouter)
routes.use('/reports', reportsRouter)

export default routes