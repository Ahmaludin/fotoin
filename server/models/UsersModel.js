import mongoose from "mongoose";

// const usersSchema = mongoose.Schema({
//   name: { type: String },
//   username: { type: String, required: true },

//   email: { type: String, required: true },
//   phone_number: { type: String },
//   password: { type: String, required: true },

//   bio: { type: String },
//   external_link: { type: String },

//   profile_photo: { type: String },
//   posts: { type: Array, default: [] },

//   refresh_token: { type: String },
// });
const usersSchema = mongoose.Schema({
  name: { type: String, default: "" },
  username: { type: String, required: true },

  email: { type: String, required: true },
  phone_number: { type: String, default: "" },
  password: { type: String, required: true },

  bio: { type: String, default: "" },
  external_link: { type: String, default: "" },

  profile_photo: { type: String, default: "" },
  posts: { type: Array, default: [] },

  refresh_token: { type: String, default: "" },
});

export default mongoose.model("User", usersSchema);
