import Link from "next/link"
import AuthLayout from "../components/AuthLayout"
import toast, { Toaster } from "react-hot-toast"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/router"
import userSession from "../utils/userSession"
import { Input } from "../components/InputField"
import Head from "next/head"

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

export default function Signin() {
  const router = useRouter()
  const [formData, setFormData] = useState({})

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
      id: "password",
      type: "password",
      placeholder: "Password",
      name: "password",
      required: true,
      onChange: (e) => setFormData({ ...formData, password: e.target.value }),
    },
  ]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      // verify with next-auth
      toast.loading("Loading...")
      const status = await signIn("credentials", {
        redirect: false,
        ...formData,
      })
      toast.dismiss()
      const { error, ok } = status
      !ok ? toast.error(error) : router.push("/")
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <AuthLayout>
      <Head>
        <title>Sign in</title>
      </Head>
      <Toaster />
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <h2 className="text-xl mb-4 font-bold">Sign in page</h2>
        {fields.map((field) => (
          <Input key={field.id} {...field} />
        ))}
        <p className="text-gray-700 text-sm mb-2">
          Don&apos;t have an account? Goto{" "}
          <Link
            href="/signup"
            className="text-blue-600  focus:underline outline-none"
          >
            sign up
          </Link>{" "}
          page.
        </p>
        <button
          type="submit"
          className="text-white bg-blue-600 font-medium rounded-full py-3 px-6 text-sm focus:ring hover:bg-blue-700 transition-colors outline-none"
        >
          Sign in
        </button>
      </form>
    </AuthLayout>
  )
}
