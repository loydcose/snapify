import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../pages/api/auth/[...nextauth]"

const userSession = async ({req, res}) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions)
    return JSON.parse(JSON.stringify(session))
  } catch (error) {
    console.error(error)
    return null
  }
}

export default userSession
