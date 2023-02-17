import { Schema, models, model } from "mongoose"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "snapify/defaults/blank-avatar_cizwrl",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

const User = models.User || model("User", userSchema)
module.exports = User
