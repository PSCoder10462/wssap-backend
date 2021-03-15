import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms", // collection
    },
  ],
});

userSchema.plugin(findOrCreate);

export default mongoose.model("user", userSchema);
