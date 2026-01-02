import { Router } from "express";

import checkAuthentication from "../../shared/middlewares/checkAuthentication";

import EventsController from "./controllers/EventsController";

import { validateEventCreate, validateEventUpdate } from "./middlewares/validateEvents";
import checkPermission from "../../shared/middlewares/checkPermission";
import { PERMISSIONS } from "../../shared/utils/Permissions";

const eventsRouter = Router();

const eventsController = new EventsController()

eventsRouter.get(
    "/",
    checkAuthentication,
    (req, res) => eventsController.get(req, res)
)

eventsRouter.get(
    "/show",
    checkAuthentication,
    (req, res) => eventsController.show(req, res)
)

eventsRouter.post(
    "/",
    checkAuthentication,
    checkPermission(PERMISSIONS.EVENT_CREATE),
    validateEventCreate,
    (req, res) => eventsController.create(req, res)
)

eventsRouter.put(
    "/:id",
    checkAuthentication,
    checkPermission(PERMISSIONS.EVENT_UPDATE),
    validateEventUpdate,
    (req, res) => eventsController.update(req, res)
)

eventsRouter.delete(
    "/:id",
    checkAuthentication,
    (req, res) => eventsController.delete(req, res)
)

export default eventsRouter