import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "../../../database/dbConnect"
import User from "../../../database/models/user"
import bcrypt from "bcrypt"

export const authOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      authorize: async (credentials, req) => {
        const { contact, password, sessionId } = credentials

        let user = null
        await dbConnect()

        if (sessionId) {
          user = await User.findOne({ _id: sessionId })
          if (!user) throw new Error("There's something wrong")
        } else {
          // validate user
          user = await User.findOne({ contact })
          if (!user) throw new Error("Contact or password incorrect")
          const match = bcrypt.compareSync(password, user.password)
          if (!match) throw new Error("Contact or password incorrect")
        }

        // remove unnecessary props and return as payload
        const { password: secret, ...others } = user._doc
        return others
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token = { ...token, ...user }
      return token
    },
    async session({ session, token }) {
      if (token) session = { ...session.user, ...token }
      return session
    },
  },
}

export default NextAuth(authOptions)
