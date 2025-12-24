const express = require("express");
const router = express.Router();

const unitsController = require("../controllers/units.controller");

const {authenticate, authenticateRole} = require("../middleware/auth.middleware")

router.patch('/:id', authenticate, unitsController.update);

router.delete(":id", authenticate, unitsController.delete);

router.get('/:id', unitsController.getDetail);

// router.post("/:id/business-hours", authenticate, unitsController.addBusinessHour)

// router.put('/:id/business-hours', authenticate, unitsController.putBusinessHour);

// router.get('/:id/availability', unitsController.getAvailability);

// router.post("/:id/reservations", authenticate, authenticateRole(["CUSTOMER"]), unitsController.createReservation);

// router.get("/:id/reviews", unitsController.getReviews)



// router.post("/", unitsController.createUnit);
// router.get("/", unitsController.getUnits);
// router.get("/:unitId", unitsController.getUnitById);
// router.put("/:unitId", unitsController.updateUnit);
// router.delete("/:unitId", unitsController.deleteUnit);

// router.get("/:id/reviews", unitsController.getUnitReviews);
// router.get("/:id/availability", unitsController.getUnitAvailability);
// // router.get("/:id/availability", unitsController.getUnitAvailability);
// // router.get("/:id/availability", unitsController.getUnitAvailability);
module.exports = router;
