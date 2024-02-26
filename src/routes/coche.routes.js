import { Router } from "express";
import { methods as cocheController } from "../controllers/coche.controller";

const router = Router();

//router.post("/", cocheController.uploadCocheImage, cocheController.addCoche);


router.get("/", cocheController.getCoches)
router.get("/:id", cocheController.getCoche)
router.post("/", cocheController.addCoche)
router.delete("/:id", cocheController.deleteCoche)
router.put("/:id", cocheController.updateCoche)
router.get("/sort/coche", cocheController.getCochesSorted)

export default router;