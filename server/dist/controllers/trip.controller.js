import tripsService from "../services/trips.service.js";
import usersService from "../services/users.service.js";
//function to add a trip into the trips database and the trips array of the user
const addTrip = async (req, res) => {
    const currentUser = req.user;
    try {
        //get the user
        const user = await usersService.getUserDetails(currentUser.id, "googleId");
        //check if the user exists
        if (!user) {
            throw new Error("User Not Found");
        }
        //add the trip and get the newly created trip
        const trip = await tripsService.addTrip(req.body, user._id);
        //add a trip to the given user's trips array
        await usersService.addTrip(currentUser.id, trip._id);
        res.status(200).json(trip);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
//function to get the details of a trip
const getTripDetails = async (req, res) => {
    try {
        res.status(200).json(await tripsService.getTripDetails(req.params.tripId));
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
//function to delete a trip from both the trips database
//from the owners trip array and the collaborators trips array
const deleteTrip = async (req, res) => {
    const currentUser = req.user;
    try {
        //get the trip wanting to be deleted
        const trip = await tripsService.getTripDetails(req.params.tripId);
        //check if the trip exists
        if (!trip) {
            throw new Error("Trip Not Found");
        }
        //get the owner of the trip
        const tripOwner = await usersService.getUserDetails(trip.owner, "_id");
        //check if the user trying to delete the trip is the owner
        //delete the trip from the owner's trips array
        await usersService.deleteTrip(currentUser.id, req.params.tripId);
        //go through all the collaborators from the trip being deleted
        //if the owner deletes the trip
        if (tripOwner?.googleId == currentUser.id) {
            for (const collaboratorId of trip.collaborators || []) {
                //find the collaborator
                const collaborator = await usersService.getUserDetails(collaboratorId, "_id");
                if (!collaborator) {
                    throw new Error("User Not Found");
                }
                //delete it from the collaborator's trips array
                await usersService.deleteTrip(collaborator?.googleId, req.params.tripId);
            }
            //delete the trip from the owner's database and
            res.status(200).json(await tripsService.deleteTrip(req.params.tripId));
        }
        //else remove the collaborator from the trip
        else {
            const user = await usersService.getUserDetails(req.params.id, "googleId");
            res
                .status(200)
                .json(await tripsService.removeCollaborator(req.params.tripId, user?._id));
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
//
const addCollaborator = async (req, res) => {
    try {
        const collaborator = await usersService.getUserDetails(req.body.collaborator, req.body.searchBy);
        if (!collaborator) {
            throw new Error("User not found");
        }
        await usersService.addTrip(collaborator.googleId, req.params.tripId);
        res
            .status(200)
            .json(await tripsService.addCollaborator(req.params.tripId, collaborator._id));
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const removeCollaborator = async (req, res) => {
    try {
        const collaborator = await usersService.getUserDetails(
        //googleId string
        req.body.collaborator, req.body.searchBy);
        if (!collaborator) {
            throw new Error("User not found");
        }
        await usersService.deleteTrip(req.body.collaborator, req.params.tripId);
        res
            .status(200)
            .json(await tripsService.removeCollaborator(req.params.tripId, collaborator._id));
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export default {
    addTrip,
    getTripDetails,
    deleteTrip,
    addCollaborator,
    removeCollaborator,
};
//# sourceMappingURL=trip.controller.js.map