import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { FaFire } from "react-icons/fa"
import { FiSearch } from "react-icons/fi"

export default function Search({ className, trending, setDisplayMenu }) {
  const searchRef = useRef()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // setting up loader state
  useEffect(() => {
    setLoading(false)
  }, [trending])

  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/search?value=${searchRef.current.value}`)
    setDisplayMenu(false)
  }

  return (
    <section className={className + " rounded-xl lg:mb-0"}>
      {/* search bar */}
      <form
        onSubmit={handleSearch}
        className="border justify-between flex items-center rounded-lg px-3 border-gray-300 focus-within:ring-[2px] focus-within:ring-blue-600 transition overflow-hidden mb-8"
      >
        <input
          ref={searchRef}
          type="text"
          size="1"
          placeholder="Search user, topics, etc."
          className="p-3 w-full outline-none text-sm bg-transparent"
        />
        <button
          type="submit"
          className="rounded-md flex w-10 hover:bg-gray-100 aspect-square"
        >
          <FiSearch className="text-blue-600 m-auto text-lg" />
        </button>
      </form>

      {/* hot topics */}
      {trending.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <FaFire className="text-blue-600 text-xl" />
            <h2 className="font-bold mt-1 md:text-lg">Hot topics</h2>
          </div>
          <ul>
            {loading && <p>Loading...</p>}
            {trending.map((topic) => (
              <li key={topic.name} className="mb-2 group">
                <Link href={`/search?value=${topic.name}`}>
                  <p className="font-semibold group-hover:text-blue-600 transition-colors text-gray-700 text-sm md:text-[15px]">
                    #{topic.name}
                  </p>
                  <span className="text-gray-500 text-sm">
                    {topic.quantity} topic{topic.quantity > 1 && "s"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
