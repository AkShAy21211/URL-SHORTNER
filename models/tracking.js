import { Schema, model, mongoose } from "mongoose";

const TrackingSchema = new Schema({
  urlId: { type: mongoose.Types.ObjectId, ref: "Url", required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: false },
  userAgent: { type: String },
  ipAddress: { type: String },
  geolocation: {
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    region: [{ type: String, default: "" }],
    timezone: { type: String, default: "" },
  },
  osName: { type: String },
  deviceName: { type: String },
});

const TrackingModel = model("Tracking", TrackingSchema);

export default TrackingModel;
