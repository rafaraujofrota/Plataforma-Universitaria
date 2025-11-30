import { Router } from "express";

import { validateEmail, validateSession, validateUserData } from "./middleware/validateUserData";
import { validateProfile } from "./middleware/validateProfile";
import checkAuthentication from "../../shared/middlewares/checkAuthentication";
import { upload } from "../../config/upload";

import UsersController from "./controllers/UsersController";
import SessionController from "./controllers/SessionController";
import ProfileController from "./controllers/ProfileController";

const usersRouter = Router();
const usersController = new UsersController();
const sessionController = new SessionController()
const profileController = new ProfileController()

// Gets 
usersRouter.get(
  "/",
	checkAuthentication,
  usersController.list,
);

usersRouter.get(
  "/verify/:id",
  usersController.verify,
)

usersRouter.get(
  "/profile",
  checkAuthentication,
  profileController.show
)

usersRouter.get(
  "/:id",
	checkAuthentication,
  usersController.show,
);

// Post 
usersRouter.post(
  "/",
  validateUserData,
  usersController.create,
)

usersRouter.post(
  "/sendEmail",
  validateEmail,
  usersController.sendEmail,
)

usersRouter.post(
	"/session",
  validateSession,
	sessionController.create
)

// Put
usersRouter.put(
  "/profile",
  checkAuthentication,
  upload.single("avatar"),
  validateProfile,
  profileController.update
)


export default usersRouter