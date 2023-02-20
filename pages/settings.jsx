import MainLayout from "../components/MainLayout"
import Image from "next/image"
import { SlTrash } from "react-icons/sl"
import { useState } from "react"
import getImageUrl from "../utils/getImageUrl"
import useSettings from "../hooks/useSettings"
import { Toaster } from "react-hot-toast"
import userSession from "../utils/userSession"
import { Input, InputField } from "../components/InputField"
import ConfirmationBox from "../components/ConfirmationBox"
import StickyBlock from "../components/StickyBlock.jsx"
import Head from "next/head"

export async function getServerSideProps(context) {
  try {
    const session = await userSession(context)

    // unsigned user will be redirected to signin page
    if (!session) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      }
    }

    return {
      props: JSON.parse(
        JSON.stringify({
          data: session,
        })
      ),
    }
  } catch (error) {
    console.error(error)
    return { props: { data: null } }
  }
}

export default function Settings({ data: session }) {
  const { image, username, contact } = session
  const [displayConfirmBox, setDisplayConfirmBox] = useState(false)
  const [formData, setFormData] = useState({})
  const { handleSubmit, handleDeleteAccount, loading } = useSettings(
    session,
    formData
  )
  const [isEditing, setIsEditing] = useState({
    image: false,
    password: false,
    inputs: false,
  })

  const fields = [
    {
      id: "username",
      type: "text",
      name: "username",
      pattern: "^[a-zA-Z0-9._-]{3,15}$",
      title:
        "Letters, numbers, periods, underscores, and dashes. Must be between 3-15 characters in length",
      label: "Username",
      placeholder: "Enter new username",
      defaultValue: username,
      onChange: (e) => handleOnChange(e.currentTarget),
      required: true,
    },
    {
      id: "contact",
      type: "text",
      name: "contact",
      pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Z|a-z]{2,}|[0-9]*$",
      title: "Enter your email or phone number only",
      label: "Contact",
      placeholder: "Enter new email or phone",
      defaultValue: contact,
      onChange: (e) => handleOnChange(e.currentTarget),
      required: true,
    },
    {
      id: "currentPassword",
      type: "password",
      name: "currentPassword",
      placeholder: "Current password",
      required: isEditing.password,
      onChange: (e) => handleOnChange(e.currentTarget),
    },
    {
      id: "newPassword",
      type: "password",
      placeholder: "New password",
      name: "newPassword",
      pattern: "^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$",
      title:
        "Contains at least one letter and one digit. Must be at least 8 characters in length",
      required: isEditing.password,
      onChange: (e) => handleOnChange(e.currentTarget),
    },
    {
      id: "confirmPassword",
      type: "password",
      name: "confirmPassword",
      placeholder: "Confirm password",
      required: isEditing.password,
      onChange: (e) => handleOnChange(e.currentTarget),
    },
  ]

  const handleOnChange = (field) => {
    const { name, value, files } = field

    switch (name) {
      case "image":
        setFormData({ ...formData, [name]: files[0] })
        setIsEditing({ ...isEditing, inputs: true, image: true })
        break
      case "currentPassword":
      case "newPassword":
      case "confirmPassword":
        setFormData({ ...formData, [name]: value })
        setIsEditing({ ...isEditing, inputs: true, password: true })
        break
      default:
        setFormData({ ...formData, [name]: value })
        setIsEditing({ ...isEditing, inputs: true })
    }
  }

  return (
    <MainLayout>
      <Head>
        <title>Settings</title>
      </Head>
      <Toaster />
      <StickyBlock />
      <div className="p-7 bg-white rounded-lg shadow-sm">
        {displayConfirmBox && (
          <ConfirmationBox
            setDisplayConfirmBox={setDisplayConfirmBox}
            handleDeleteAccount={handleDeleteAccount}
            loading={loading}
          />
        )}

        <main className="md:max-w-[500px] w-full pb-[70px] md:py-0">
          <form onSubmit={handleSubmit} className="mb-12">
            <h2 className="md:text-xl font-bold mb-3">Settings</h2>
            <div className="w-[67px] border border-gray-300 overflow-hidden aspect-square rounded-full mb-3">
              <Image
                src={
                  isEditing.image
                    ? URL.createObjectURL(formData.image)
                    : getImageUrl + image
                }
                alt=""
                width="67"
                height="67"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative focus-within:ring-1 focus-within:ring-blue-600 border border-gray-300 px-6 py-2 mb-4 rounded-md w-fit">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleOnChange(e.currentTarget)}
                className="absolute inset-0 opacity-0"
              />
              <p className="text-gray-700 text-sm">Change profile picture</p>
            </div>
            {fields.map((field) => {
              if (field.label) {
                return <InputField key={field.id} {...field} />
              }
            })}
            <div className="flex flex-col gap-1 mb-3">
              <p className="text-sm text-gray-700 font-semibold">
                Change password
              </p>
              {fields.map((field) => {
                if (!field.label) {
                  return <Input key={field.id} {...field} />
                }
              })}
            </div>
            <button
              type="submit"
              className={`${
                isEditing.inputs
                  ? "hover:bg-blue-700 focus:ring text-white bg-blue-600"
                  : "border border-gray-300 text-gray-500 pointer-events-none bg-gray-100"
              } text-sm font-medium py-2 px-6 rounded-md`}
              disabled={loading}
            >
              Save changes
            </button>
          </form>

          <div>
            <p className="text-sm font-medium mb-1">
              Permanently delete this account?
            </p>
            <button
              type="button"
              onClick={() => setDisplayConfirmBox(true)}
              className="text-red-600 border border-red-300 bg-red-50 flex justify-center text-sm py-2 px-6 rounded-md gap-2 hover:bg-red-100 transition-colors shadow-sm focus:ring-red-300 focus:ring-1 outline-none"
            >
              <SlTrash className="text-base" />
              <span>Delete account</span>
            </button>
          </div>
        </main>
      </div>
    </MainLayout>
  )
}
