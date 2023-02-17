import Post from "../../../database/models/post"
import dbConnect from "../../../database/dbConnect"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req, res) {
  await dbConnect()
  const { postId, type } = req.query
  const session = await unstable_getServerSession(req, res, authOptions)
  const post = await Post.findOne({ _id: postId })

  switch (req.method) {
    case "PUT":
      try {
        if (type === "like") {
          const isLiked = post.likes.some((id) => id === session._id)

          if (isLiked) {
            const newLikes = post.likes.filter((like) => like !== session._id)

            post.likes = newLikes
            const savedPost = await post.save()

            res.json({
              success: false,
              message: "Unlike",
              post: savedPost,
            })
          } else {
            const temp = [...post.likes]
            temp.push(session._id)
            post.likes = temp
            const savedPost = await post.save()

            res.json({ success: true, message: "Liked", post: savedPost })
          }
        } else if (type === "comment") {
          const { comment } = req.body
          const temp = [...post.comments]
          temp.push({ commenterId: session._id, comment })
          post.comments = temp
          const savedComment = await post.save()

          res.json({ success: true, message: "Comment", comment: savedComment })
        }
      } catch (error) {
        console.error(error)
      }
      break
  }
}
