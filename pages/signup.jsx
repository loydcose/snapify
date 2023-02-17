import axios from "axios"
import Link from "next/link"
import { useState } from "react"
import AuthLayout from "../components/AuthLayout"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/router"
import userSession from "../utils/userSession"
import { Input } from "../components/InputField"

export async function getServerSideProps(context) {
  const session = await userSession(context)

  // signed user will be redirected to homepage
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return { props: {} }
}

export default function Signup() {
  const [formData, setFormData] = useState({})
  const router = useRouter()

  const fields = [
    {
      id: "contact",
      type: "text",
      placeholder: "Email or phone",
      name: "contact",
      pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Z|a-z]{2,}|[0-9]*$",
      title: "Enter your email or phone number only",
      required: true,
      onChange: (e) => setFormData({ ...formData, contact: e.target.value }),
    },
    {
      id: "username",
      type: "text",
      placeholder: "Username",
      name: "username",
      pattern: "^[a-zA-Z0-9._-]{3,15}$",
      title:
        "Letters, numbers, periods, underscores, and dashes. Must be between 3-15 characters in length",
      required: true,
      onChange: (e) => setFormData({ ...formData, username: e.target.value }),
    },
    {
      id: "password",
      type: "password",
      placeholder: "Password",
      name: "password",
      pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
      title:
        "Contains at least one letter and one digit. Must be at least 8 characters in length",
      required: true,
      onChange: (e) => setFormData({ ...formData, password: e.target.value }),
    },
    {
      id: "confirmPassword",
      type: "password",
      placeholder: "Confirm password",
      name: "confirmPassword",
      required: true,
      onChange: (e) =>
        setFormData({ ...formData, confirmPassword: e.target.value }),
    },
  ]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      toast.loading("Loading...")
      const response = await axios.post("/api/users", formData)
      const { success, message } = response.data
      toast.dismiss()
      success ? toast.success(message) : toast.error(message)

      // if success, direct user to sign in page
      success &&
        setTimeout(() => {
          router.push("/signin")
        }, 1000)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <AuthLayout>
      <Toaster />
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <h2 className="text-xl mb-4 font-bold">Sign up page</h2>
        {fields.map((field) => (
          <Input key={field.id} {...field} />
        ))}
        <p className="text-gray-700 text-sm mb-2">
          Have an account? Goto{" "}
          <Link
            href="/signin"
            className="text-blue-600 outline-none focus:underline"
          >
            sign in
          </Link>{" "}
          page.
        </p>
        <button
          type="submit"
          className="text-white bg-blue-600 font-medium rounded-full py-3 px-6 text-sm focus:ring hover:bg-blue-700 outline-none transition-colors "
        >
          Sign up
        </button>
      </form>
    </AuthLayout>
  )
}
