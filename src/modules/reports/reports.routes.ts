import { Router } from "express";

import { validateReportCreate, validateReportUpdate } from "./middlewares/validateReport";

import checkAuthentication from "../../shared/middlewares/checkAuthentication";

import ReportsController from "./controllers/ReportController";

const reportsRouter = Router();

const reportsController = new ReportsController

reportsRouter.get(
    "/",
    checkAuthentication,
    (req, res) => reportsController.get(req, res)
)

reportsRouter.get(
    "/show",
    checkAuthentication,
    (req, res) => reportsController.show(req, res)
)

reportsRouter.post(
    "/",
    checkAuthentication,
    validateReportCreate,
    (req, res) => reportsController.create(req, res)
)

reportsRouter.put(
    "/:id",
    checkAuthentication,
    validateReportUpdate,
    (req, res) => reportsController.update(req, res)
)

reportsRouter.delete(
    "/:id",
    checkAuthentication,
    (req, res) => reportsController.delete(req, res)
)

export default reportsRouter