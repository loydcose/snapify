import Post from "../../../database/models/post"
import User from "../../../database/models/user"
import dbConnect from "../../../database/dbConnect"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { v2 as cloudinary } from "cloudinary"
import { isValidObjectId } from "mongoose"
import fetchPosts from "../../../utils/fetchPosts"

// cloudinary config for uploading & deleting a post
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// default is 1mb, changed to 100 to avoid request errors
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
}

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions)
  await dbConnect()

  switch (req.method) {
    case "GET":
      const { feed, value: search } = req.query
      const page = req.query.page || 1
      const noSkip = req.query.noSkip || false
      const limit = 4
      const index = (page - 1) * limit
      let posts = []
      let users = []

      try {
        if (search) {
          if (search.match(/^[0-9a-fA-F]{24}$/)) {
            let postRes
            if (noSkip) {
              postRes = await Post.find({ _id: search })
                .sort({ createdAt: -1 })
                .limit((page - 1) * limit)
            } else {
              postRes = await Post.find({ _id: search })
                .sort({ createdAt: -1 })
                .skip(index)
                .limit(limit)
            }
            posts = await fetchPosts(postRes, User)
          } else {
            users = await User.find({ username: search })

            let postsRes
            if (noSkip) {
              postsRes = await Post.find({ topics: { $in: search } })
                .sort({ createdAt: -1 })
                .limit((page - 1) * limit)
            } else {
              postsRes = await Post.find({ topics: { $in: search } })
                .sort({ createdAt: -1 })
                .skip(index)
                .limit(limit)
            }
            posts = await fetchPosts(postsRes, User)
          }
        } else if (feed) {
          if (feed === "foryou") {
            let filtered

            if (noSkip) {
              filtered = await Post.find()
                .sort({ createdAt: -1 })
                .limit((page - 1) * limit)
            } else {
              filtered = await Post.find()
                .sort({ createdAt: -1 })
                .skip(index)
                .limit(limit)
            }

            posts = await fetchPosts(filtered, User)
          }
          if (feed === "following") {
            if (!session) {
              return {
                redirect: {
                  destination: "/signin",
                  permanent: false,
                },
              }
            }

            const user = await User.findOne({ _id: session._id })
            let filtered

            if (noSkip) {
              filtered = await Post.find({
                authorId: { $in: user.following },
              })
                .sort({ createdAt: -1 })
                .limit((page - 1) * limit)
            } else {
              filtered = await Post.find({
                authorId: { $in: user.following },
              })
                .sort({ createdAt: -1 })
                .skip(index)
                .limit(limit)
            }

            posts = await fetchPosts(filtered, User)
          }
        }

        res.json({
          success: true,
          message: "",
          posts,
          users,
        })
      } catch (error) {
        console.error(error)
        res.json({
          success: false,
          message: "",
          posts: [],
          users: [],
        })
      }
      break
    case "POST":
      try {
        const { topics, caption, images } = req.body

        // upload to cloudinary
        const uploadedImages = await Promise.all(
          images.map(async (image) => {
            const result = await cloudinary.uploader.upload(image, {
              folder: "snapify/posts",
              upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
            })
            return result.public_id
          })
        )

        // store to database
        const data = {
          authorId: session._id,
          topics,
          content: { caption, images: uploadedImages },
        }
        const createdPost = await Post.create(data)

        res.json({
          success: true,
          message: "Your snap has been posted",
          post: createdPost,
        })
      } catch (error) {
        console.error(error)
        res.json({
          success: false,
          message: `Error: ${error.message}`,
        })
      }
      break
  }
}
