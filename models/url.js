import { model, Schema, Types } from "mongoose";

const URLSchema = new Schema(
  {
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    customAlias: { type: String, unique: false },
    topic: { type: String, required: false },
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const UrlModel = model("Url", URLSchema);

export default UrlModel;
