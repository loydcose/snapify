import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { HiOutlinePencilAlt } from "react-icons/hi"
import Logo from "/public/logo.svg"
import Search from "./Search"
import { useRouter } from "next/router"
import MenuLinks from "./MenuLinks"

export default function MainMenu({ className, setDisplayNew, trending,  setDisplayMenu }) {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <aside className={className + " flex-col gap-12 flex"}>
      <Link href="/">
        <Image
          src={Logo}
          alt="Snapify logo"
          className="w-[120px]"
          width="50"
          height="50"
          priority
        />
      </Link>
      <Search className="xl:hidden" trending={trending} setDisplayMenu={setDisplayMenu}/>

      <MenuLinks session={session} />

      <button
        type="button"
        onClick={() => {
          if (!session) return router.push("/signin")
          setDisplayNew((prev) => !prev)
        }}
        className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-600 transition-colors focus:ring outline-none p-4 flex items-center gap-2 justify-center rounded-xl shadow-sm"
      >
        <HiOutlinePencilAlt className="mb-[2px] text-xl text-white/[.6]" />
        <span className="font-semibold text-sm md:text-[15px]">
          Post a snap
        </span>
      </button>
    </aside>
  )
}
