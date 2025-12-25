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
  (req, res) => usersController.list(req, res),
);

usersRouter.get(
  "/verify/:id",
  (req, res) => usersController.verify(req, res),
)

usersRouter.get(
  "/profile",
  checkAuthentication,
  (req, res) => profileController.show(req, res)
)

usersRouter.get(
  "/:id",
	checkAuthentication,
  (req, res) => usersController.show(req, res),
);

// Post 
usersRouter.post(
  "/",
  validateUserData,
  (req, res) => usersController.create(req, res),
)

usersRouter.post(
  "/sendEmail",
  validateEmail,
  (req, res) => usersController.sendEmail(req, res),
)

usersRouter.post(
	"/session",
  validateSession,
	(req, res) => sessionController.create(req, res)
)

// Put
usersRouter.put(
  "/profile",
  checkAuthentication,
  upload.single("avatar"),
  validateProfile,
  (req, res) => profileController.update(req, res)
)


export default usersRouter