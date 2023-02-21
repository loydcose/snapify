import { signOut } from "next-auth/react"
import Link from "next/link"
import { AiOutlineLogout, AiOutlineUser } from "react-icons/ai"
import { BsGear } from "react-icons/bs"

export default function MenuLinks({ session }) {
  const style = {
    link: "group flex items-center gap-2",
    icon: "text-xl text-gray-400 transition-colors group-hover:text-blue-600",
    text: "text-gray-600 transition-colors group-hover:text-blue-600 font-medium text-sm md:text-[15px]",
  }

  return (
    <ul className="flex flex-col items-start gap-2">
      {session ? (
        <>
          <li>
            <Link href={`/user/${session.username}`} className={style.link}>
              <AiOutlineUser className={style.icon} />
              <span className={style.text}>Profile</span>
            </Link>
          </li>
          <li>
            <Link href="/settings" className={style.link}>
              <BsGear className={style.icon} />
              <span className={style.text}>Settings</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => signOut()}
              className={style.link}
            >
              <AiOutlineLogout className={style.icon} />
              <span className={style.text}>Sign out</span>
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href="/signup" className={style.link}>
              <span className={style.text}>Register</span>
            </Link>
          </li>
          <li>
            <Link href="/signin" className={style.link}>
              <span className={style.text}>Sign in</span>
            </Link>
          </li>
        </>
      )}
    </ul>
  )
}
