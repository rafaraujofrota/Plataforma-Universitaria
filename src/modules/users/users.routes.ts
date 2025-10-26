import { Router } from "express";
import UsersControllers from "./controllers/UsersController";
import validateUserData from "./middleware/validateUserData";

const usersRouter = Router();
const usersController = new UsersControllers();

usersRouter.get(
  "/",
  usersController.list,
);

usersRouter.post(
  "/",
  validateUserData,
  usersController.create,
)

export default usersRouter