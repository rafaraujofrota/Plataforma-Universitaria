import { Router } from "express";

import { 
    validateAnnouncementsCreate, 
    validateAnnouncementsUpdate,
} from "./middlewares/validateAnnouncements";

import checkAuthentication from "../../shared/middlewares/checkAuthentication";
import AnnouncementsController from "./controllers/AnnouncementController";

const announcementsRouter = Router();

const announcementsController = new AnnouncementsController()

announcementsRouter.get(
    "/",
    checkAuthentication,
    (req, res) => announcementsController.get(req, res)
)

announcementsRouter.get(
    "/show",
    checkAuthentication,
    (req, res) => announcementsController.show(req, res)
)

announcementsRouter.post(
    "/",
    checkAuthentication,
    validateAnnouncementsCreate,
    (req, res) => announcementsController.create(req, res)
)

announcementsRouter.put(
    "/:id",
    checkAuthentication,
    validateAnnouncementsUpdate,
    (req, res) => announcementsController.update(req, res)
)

announcementsRouter.delete(
    "/:id",
    checkAuthentication,
    (req, res) => announcementsController.delete(req, res)
)

export default announcementsRouter