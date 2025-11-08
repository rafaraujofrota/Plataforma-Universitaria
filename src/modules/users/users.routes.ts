import { Router } from "express";

import validateUserData from "./middleware/validateUserData";
import checkAuthentication from "../../shared/middlewares/checkAuthentication";

import UsersController from "./controllers/UsersController";
import SessionController from "./controllers/SessionController";

const usersRouter = Router();
const usersController = new UsersController();
const sessionController = new SessionController()

// Rota para testes
usersRouter.get(
  "/",
	checkAuthentication,
  usersController.list,
);

usersRouter.post(
	"/session",
	sessionController.create
)

usersRouter.post(
  "/",
  validateUserData,
  usersController.create,
)

export default usersRouter