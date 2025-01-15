import { model, Schema } from "mongoose";

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", userSchema);

export default UserModel;
