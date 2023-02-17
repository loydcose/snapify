import User from "../../../database/models/user"
import dbConnect from "../../../database/dbConnect"
import updateUser from "../../../utils/updateUser"
import bcrypt from "bcrypt"
import deleteUser from "../../../utils/deleteUser"

// default is 1mb, changed to 100 to avoid request errors
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
}

export default async function handler(req, res) {
  await dbConnect()

  try {
    switch (req.method) {
      case "POST":
        const { contact, username, password, confirmPassword } = req.body

        // validate passwords
        if (password !== confirmPassword) {
          res.json({ success: false, message: "Password didn't match" })
          return
        }

        // unique credentials check
        const contactExist = await User.findOne({ contact })
        if (contactExist) {
          return res.json({
            success: false,
            message: "Contact is already exist",
          })
        }
        const usernameExist = await User.findOne({ username })
        if (usernameExist) {
          return res.json({
            success: false,
            message: "Username is already exist",
          })
        }

        // hash password & register the user
        const hash = bcrypt.hashSync(password, 10)
        await User.create({ contact, username, password: hash })

        res.json({ success: true, message: "Account registered" })
        break
      case "PUT":
        await updateUser(req, res)
        break
      case "DELETE":
        await deleteUser(req, res)
        break
    }
  } catch (error) {
    console.error(error)
    res.json({
      success: false,
      message: `Error: ${error.message}`,
    })
  }
}
