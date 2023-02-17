import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import User from "../database/models/user"
import { v2 as cloudinary } from "cloudinary"
import Post from "../database/models/post"

// cloudinary config for uploading & deleting a post
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const deleteUser = async (req, res) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions)

    // find user's collections
    const [user, posts] = await Promise.all([
      User.findOne({ _id: session._id }),
      Post.find({ authorId: session._id }),
    ])

    // remove user image in cloudinary
    const userImage =
      user.image.split("/")[1] !== "defaults"
        ? await cloudinary.uploader.destroy(user.image)
        : null

    // remove user posts images in cloudinary
    const postsRes =
      posts.length > 0
        ? await Promise.all(
            posts.map(async (post) => {
              const images = post.content.images
              return images.length > 0
                ? await Promise.all(
                    images.map(async (image) => {
                      if (image.split("/")[1] !== "defaults") {
                        const response = await cloudinary.uploader.destroy(
                          image
                        )
                        return response
                      }
                    })
                  )
                : []
            })
          )
        : []

    // delete user, user posts & user comments
    const postsCommented = await Post.find({
      "comments.commenterId": session._id,
    })

    const removedUser = await User.deleteOne({ _id: session._id })
    const removedPosts = await Post.deleteMany({ authorId: session._id })

    const removedComments =
      postsCommented.length > 0
        ? await Promise.all(
            postsCommented.map(async (post) => {
              if (post.comments.length > 0) {
                const filtered = post.comments.filter((comment) => {
                  return comment.commenterId.toString() !== session._id
                })

                post.comments = [...filtered]
                return await post.save()
              }
            })
          )
        : []

    res.json({
      success: true,
      message: "Account deleted",
      result: {
        userAssets: userImage,
        postsAssets: postsRes.flat(),
        removedUser,
        removedPosts,
        removedComments,
      },
    })
  } catch (error) {
    console.error(error.message)
    res.json({
      success: false,
      message: "There's something wrong",
    })
  }
}

export default deleteUser
