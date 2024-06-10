import locationsController from "../controllers/locations.controller.js";
import { Router } from "express";
const router = Router();

router.get("/countries/:continent", locationsController.getAllCountries);
router.get("/states/:country", locationsController.getAllStates);
router.get("/cities/:state/:country", locationsController.getAllCities);
router.get("/airports/:city/:countryCode", locationsController.getAllAirports);
router.get("/flights", locationsController.getAllFlights);
router.get("/hotels/:city/:countryCode", locationsController.getAllHotels);
export default router;
