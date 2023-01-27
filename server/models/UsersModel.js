import mongoose from "mongoose";

const usersSchema = mongoose.Schema({
  name: { type: String },
  username: { type: String, required: true },

  email: { type: String, required: true },
  phone_number: { type: String },
  password: { type: String, required: true },

  bio: { type: String },
  external_link: { type: String },

  profile_photo: { type: String },
  posts: { type: Array, default: [] },

  refresh_token: { type: String },
});

export default mongoose.model("User", usersSchema);
