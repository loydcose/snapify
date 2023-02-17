import User from "../../../database/models/user"
import dbConnect from "../../../database/dbConnect"

export default async function handler(req, res) {
  const { userId } = req.query
  await dbConnect()

  if (req.method === "GET") {
    try {
      let user = await User.findOne({ _id: userId })
      const { password, ...rest } = user._doc
      res.json({ success: true, message: "", user: rest })
    } catch (error) {
      console.error(error.message)
      return res.json({ success: false, message: `Error: ${error.message}` })
    }
  }
}
