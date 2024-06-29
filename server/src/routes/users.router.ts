import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import tripController from "../controllers/trip.controller.js";
const router = Router();

router.get("/current", usersController.getCurrentUser);
router.put("/:id", usersController.editUserDetails);
router.get("/:id", usersController.getUserDetails);
router.post("/:id/trips", tripController.addTrip);
router.get("/:id/trips/:tripId", tripController.getTripDetails);
router.post("/:id/trips/:tripId", tripController.addLocationToTrip);
router.post("/:id/trips/:tripId/remove", tripController.removeLocationFromTrip);
router.put("/:id/trips/:tripId", tripController.editTripDetails);
router.delete("/:id/trips/:tripId", tripController.deleteTrip);
router.post("/:id/trips/:tripId/collaborator", tripController.addCollaborator);
router.delete(
  "/:id/trips/:tripId/collaborator",
  tripController.removeCollaborator
);
export default router;
