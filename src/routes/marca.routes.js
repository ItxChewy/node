import { Router } from "express";

import { methods as marcaController } from "../controllers/marca.controller";

const router = Router();

router.get("/:nombre", marcaController.getCochesMarca)

export default router;