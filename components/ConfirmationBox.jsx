import { FiAlertCircle } from "react-icons/fi"

export default function ConfirmationBox({
  setDisplayConfirmBox,
  handleDeleteAccount,
  loading,
}) {
  return (
    <div className="bg-white z-30 fixed -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 p-4 rounded-lg flex items-start gap-3 shadow-xl w-full max-w-[350px]">
      <FiAlertCircle className="text-red-600 shrink-0 text-3xl" />

      <div>
        <h3 className="text-sm md:text-[15px]">
          Are you sure do you want to delete your account?
        </h3>
        <div className="flex mt-4 items-center gap-2 ml-auto w-fit">
          <button
            type="button"
            onClick={(e) => setDisplayConfirmBox(false)}
            className="py-2 px-4 rounded-md text-gray-600 ring-1 bg-gray-50 hover:bg-gray-100 transition outline-none focus:ring ring-gray-300 text-sm"
          >
            No
          </button>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white py-2 px-4 rounded-md text-sm transition outline-none hover:bg-red-700 focus:ring focus:ring-red-200"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
