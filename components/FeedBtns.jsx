import Link from "next/link"
import { useRouter } from "next/router"

export default function FeedBtns() {
  const router = useRouter()
  const isDefaultRoute =
    router.asPath === "/" || router.asPath === "/?feed=foryou"

  return (
    <>
      <nav className="bg-white sticky z-20 top-[20px] md:top-8 inset-y-0 flex items-center justify-center gap-6 border-b border-b-gray-300">
        {["foryou", "following"].map((feed) => {
          return (
            <Link
              key={feed}
              href={`/?feed=${feed}`}
              className={`${
                feed == "foryou"
                  ? isDefaultRoute && "border-b-[3px] border-b-blue-600"
                  : !isDefaultRoute && "border-b-[3px] border-b-blue-600"
              } font-bold text-sm md:text-[15px] py-4 basis-1/5 text-center hover:text-blue-600 transition-colors`}
            >
              {feed == "foryou" ? "For you" : "Following"}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
