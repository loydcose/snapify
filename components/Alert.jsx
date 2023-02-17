import { RiUserUnfollowLine } from "react-icons/ri"
import { MdSearchOff } from "react-icons/md"

export default function Alert({ type, message, className }) {
  return (
    <div className={"flex flex-col items-center justify-center gap-3 bg-white py-12 " + className}>
      {type === "unFound" ? (
        <MdSearchOff className="text-gray-500 text-4xl" />
      ) : type === "noFollowing" ? (
        <RiUserUnfollowLine className="text-gray-500 text-4xl" />
      ) : null}
      <h3
        className="text-sm md:text-base text-gray-900 font-semibold tracking-tight
      "
      >
        {message}
      </h3>
    </div>
  )
}
