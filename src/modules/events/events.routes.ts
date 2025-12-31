import { Router } from "express";

import checkAuthentication from "../../shared/middlewares/checkAuthentication";

import EventsController from "./controllers/EventsController";

import { validateEventCreate, validateEventUpdate } from "./middlewares/validateEvents";

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
    validateEventCreate,
    (req, res) => eventsController.create(req, res)
)

eventsRouter.put(
    "/:id",
    checkAuthentication,
    validateEventUpdate,
    (req, res) => eventsController.update(req, res)
)

eventsRouter.delete(
    "/:id",
    checkAuthentication,
    (req, res) => eventsController.delete(req, res)
)

export default eventsRouter