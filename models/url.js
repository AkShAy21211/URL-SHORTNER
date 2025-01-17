import {model, Schema} from "mongoose"

const URLSchema = new Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  customAlias: { type: String, unique: true },
  topic: { type: String, required: false },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

const UrlModel  = model("Url",URLSchema);

export default UrlModel;