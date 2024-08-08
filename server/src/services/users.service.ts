import userModel from "../models/users.model.js";
import mongoose from "mongoose";
const userExists = async (email: string): Promise<boolean> => {
  const user = await userModel.findOne({ email });
  return user ? true : false;
};

const addUser = async (
  googleId: string,
  email: string,
  picture: string
): Promise<void> => {
  await userModel.create({
    googleId,
    email,
    picture,
  });
};

const editUserDetails = async (
  googleId: string,
  name: string,
  passport: object,
  currencyUsed: string
) => {
  return await userModel.findOneAndUpdate(
    { googleId },
    {
      $set: {
        name,
        passport,
        currencyUsed,
      },
    },
    { new: true }
  );
};

const getUserDetails = async (collaboratorInfo: string, searchBy: string) => {
  return await userModel
    .findOne({ [`${searchBy}`]: collaboratorInfo })
    .populate("trips")
    .exec();
};

const findUserById = async (id: mongoose.Types.ObjectId) => {
  return await userModel.findById(id);
};

const addTrip = async (
  googleId: string,
  tripId: mongoose.Types.ObjectId | string
) => {
  return await userModel.findOneAndUpdate(
    { googleId },
    {
      $push: {
        trips:
          typeof tripId == "string"
            ? new mongoose.Types.ObjectId(tripId)
            : tripId,
      },
    },
    { new: true }
  );
};

const deleteTrip = async (googleId: string, tripId: string) => {
  return await userModel.findOneAndUpdate(
    { googleId },
    {
      $pull: {
        trips: tripId,
      },
    },
    { new: true }
  );
};

export default {
  addUser,
  userExists,
  editUserDetails,
  getUserDetails,
  addTrip,
  deleteTrip,
  findUserById,
};
