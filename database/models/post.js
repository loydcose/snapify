import { Schema, models, model } from "mongoose"

const postSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topics: {
      type: Array,
    },
    content: {
      caption: {
        type: String,
      },
      images: {
        type: Array,
        required: true,
      },
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        commenterId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
)

const Post = models.Post || model("Post", postSchema)
module.exports = Post
