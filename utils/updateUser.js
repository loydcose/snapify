import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import User from "../database/models/user"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"

// cloudinary config for uploading & deleting a post
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const updateUser = async (req, res) => {
  const { type } = req.query
  const session = await unstable_getServerSession(req, res, authOptions)
  let user = await User.findOne({ _id: session._id })

  switch (type) {
    case "info":
      // change password
      if (req.body?.newPassword) {
        const { currentPassword, newPassword, confirmPassword } = req.body

        // password validations
        if (newPassword !== confirmPassword) {
          res.json({ success: false, message: "Password did not match" })
          return
        }
        const match = bcrypt.compareSync(currentPassword, user.password)
        if (!match) {
          res.json({ success: false, message: "Password incorrect" })
          return
        }

        // hash password before storing to database
        const hash = bcrypt.hashSync(newPassword, 10)
        user.password = hash
      }

      // change username
      if (req.body?.username) {
        const { username } = req.body
        const usernameExist = await User.findOne({ username })
        if (usernameExist) {
          return res.json({
            success: false,
            message: "Username is already exist",
          })
        }
        user.username = username
      }

      // change contact
      if (req.body?.contact) {
        const { contact } = req.body

        const contactExist = await User.findOne({ contact })
        if (contactExist) {
          return res.json({
            success: false,
            message: "Contact is already exist",
          })
        }
        user.contact = contact
      }

      // change profile picture
      if (req.body?.image) {
        const { image } = req.body
        // delete the previous image first in the cloudinary
        const deleteRes = await cloudinary.uploader.destroy(session.image)

        // upload the image to cloudinary
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: "snapify/users",
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        })

        // set the new image
        user.image = uploadRes.public_id
      }
      break
    case "follow":
      const { authorId } = req.query
      const { following } = user
      const author = await User.findOne({ _id: authorId })

      const isFollowed = following.some((user) => user === authorId)
      let userFollowing = [...following]
      let authorFollowers = [...author.followers]

      // if followed, un-follow and vice versa
      if (isFollowed) {
        userFollowing = following.filter((user) => user !== authorId)
        authorFollowers = author.followers.filter(
          (user) => user !== session._id
        )
      } else {
        userFollowing.push(authorId)
        authorFollowers.push(session._id)
      }

      // finally save author ad user
      user.following = userFollowing
      author.followers = authorFollowers
      await author.save()
      break
  }
  const updatedUser = await user.save()
  res.json({
    success: true,
    message: "Account updated",
    user: updatedUser,
  })
}

export default updateUser
