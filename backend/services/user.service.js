import { UserModel } from "../models/user.model.js";

export const findOrCreateUser = async ({ email, name, businessName }) => {
  try {
    // Try to find existing user by email
    let user = await UserModel.findOne({ email });

    // If user doesn't exist, create new user
    if (!user) {
      user = await UserModel.create({
        email,
        name,
        businessName,
      });
    }

    return user;
  } catch (error) {
    console.error("Error in findOrCreateUser:", error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    return await UserModel.findOne({ email });
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    throw error;
  }
};
