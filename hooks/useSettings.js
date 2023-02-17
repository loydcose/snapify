import toast from "react-hot-toast"
import axios from "axios"
import { signIn, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"

export default function useSettings(session, formData) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    toast.loading("Loading")
    setLoading(true)
    let options = { ...formData }

    try {
      // convert image file into base64 first
      if (formData.image) {
        const image = await new Promise((resolve) => {
          let baseURL = ""
          let reader = new FileReader()
          reader.readAsDataURL(formData.image)
          reader.onload = () => {
            baseURL = reader.result
            resolve(baseURL)
          }
        })
        options.image = image
      }

      const response = await axios.put("/api/users?type=info", options)
      const { success, message } = response.data

      // show error notification
      if (!success) {
        toast.dismiss()
        setLoading(false)
        toast.error(message)
        return
      }

      // if no error, update the session token
      await signIn("credentials", {
        redirect: false,
        sessionId: session._id,
      })

      router.reload()
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      toast.loading("Loading...")
      setLoading(true)
      const response = await axios.delete("/api/users")
      const { success, message } = response.data
      toast.dismiss()
      setLoading(false)

      if (!success) {
        toast.error(message)
        return
      }

      // after deletion, clear cookies and redirect to signin page
      signOut()
      router.push("/signin")
    } catch (error) {
      console.error(error.message)
    }
  }

  return { handleSubmit, handleDeleteAccount, loading }
}
