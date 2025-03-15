import express from "express";
import {
  addGadget,
  decommissionGadget,
  getGadgetByStatus,
  getGadgets,
  TriggerSelfDestruct,
  updateGadget,
} from "../controllers/Gadget.controller.js";
import { verifyToken } from "../middlewares/AuthN.js";
import authorize from "../middlewares/AuthZ.js";

const router = express.Router();

router.get("/getAll", verifyToken, getGadgets);

router.get("/:status", verifyToken, getGadgetByStatus);

router.post("/", verifyToken, authorize(["Quartermaster"]), addGadget);

router.patch("/:id", verifyToken,authorize(["Quartermaster"]), updateGadget);

router.patch(
  "/:id/decommission",
  verifyToken,
  authorize(["Quartermaster"]),
  decommissionGadget
);
router.post(
    "/:id/triggerSelfDestruct",
    verifyToken,
    authorize(["Quartermaster"]),
    TriggerSelfDestruct
  );

export default router;
