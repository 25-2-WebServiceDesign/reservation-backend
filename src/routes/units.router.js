const express = require("express");
const router = express.Router();

const unitsController = require("../controllers/units.controller");

router.post("/", unitsController.createUnit);
router.get("/", unitsController.getUnits);
router.get("/:unitId", unitsController.getUnitById);
router.put("/:unitId", unitsController.updateUnit);
router.delete("/:unitId", unitsController.deleteUnit);

router.get("/:id/availability", unitsController.getUnitAvailaility);
router.get("/:id/availability", unitsController.getUnitAvailability);
router.get("/:id/availability", unitsController.getUnitAvailability);
module.exports = router;
