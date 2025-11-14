import { Router } from "express";

import { validateSession, validateUserData, validateProfile} from "./middleware/validateUserData";
import checkAuthentication from "../../shared/middlewares/checkAuthentication";
import { upload } from "../../config/upload";

import UsersController from "./controllers/UsersController";
import SessionController from "./controllers/SessionController";
import ProfileController from "./controllers/ProfileController";

const usersRouter = Router();
const usersController = new UsersController();
const sessionController = new SessionController()
const profileController = new ProfileController()

// Rota para testes
usersRouter.get(
  "/",
	checkAuthentication,
  usersController.list,
);

usersRouter.post(
  "/",
  validateUserData,
  usersController.create,
)

usersRouter.post(
	"/session",
  validateSession,
	sessionController.create
)

usersRouter.get(
  "/profile",
  checkAuthentication,
  profileController.show
)

usersRouter.put(
  "/profile",
  checkAuthentication,
  upload.single("avatar"),
  validateProfile,
  profileController.update
)


export default usersRouter