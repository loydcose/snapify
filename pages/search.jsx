import MainLayout from "../components/MainLayout"
import Image from "next/image"
import Post from "../components/Post"
import getImageUrl from "../utils/getImageUrl"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import Link from "next/link"
import { FiSearch } from "react-icons/fi"
import useScroll from "../hooks/useScroll"
import encodeUrl from "../utils/encodeUrl"
import getApiUrl from "../getApiUrl"
import axios from "axios"
import StickyBlock from "../components/StickyBlock.jsx"
import Head from "next/head"

export async function getServerSideProps(context) {
  try {
    const { req, res, query } = context
    const { value } = query
    const baseUrl = "/api/post"
    let response = null

    // fetch posts according to provided queries
    const session = await unstable_getServerSession(req, res, authOptions)
    const options = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie,
      },
    }

    // if we no dot have value for value
    if (!value) {
      response = []
    } else {
      const url = encodeUrl(`${getApiUrl() + baseUrl}`, { value })
      response = await axios.get(url, options)
    }

    return {
      props: JSON.parse(
        JSON.stringify({
          data: session,
          initialPosts: response.data.posts,
          users: response.data.users,
          query,
        })
      ),
    }
  } catch (error) {
    console.error(error)
    return {
      props: JSON.parse(
        JSON.stringify({ data: {}, initialPosts: [], users: [], query: {} })
      ),
    }
  }
}

export default function Search({ data: session, initialPosts, users, query }) {
  const { baseUrl, page, posts, setPosts, hasMore } = useScroll(
    initialPosts,
    query
  )

  return (
    <MainLayout>
      <Head>
        <title>Search</title>
      </Head>
      <StickyBlock />

      <div className="py-7 bg-white shadow-sm rounded-lg">
        <p className="text-gray-700 font-medium text-sm mb-6 px-6">
          Search results
        </p>
        {users.length === 0 && posts.length === 0 && (
          <section className="flex flex-col items-center gap-2 mx-auto mt-12">
            <FiSearch className="text-blue-600 text-xl" />
            <p className="text-lg font-bold text-gray-900">No results found.</p>
          </section>
        )}
        {users.length !== 0 && (
          <section className="mb-12 px-6">
            <h2 className="font-bold text-lg text-gray-900 mb-3">Users</h2>
            <div className="flex items-center gap-3 flex-wrap">
              {users.map((user) => {
                const { _id, username, image } = user

                return (
                  <Link
                    href={`/user/${username}`}
                    key={_id}
                    className="border border-gray-300 rounded-xl py-3 px-5 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-[36px] overflow-hidden aspect-square rounded-full">
                      <Image
                        src={getImageUrl + image}
                        className="h-full w-full object-cover"
                        width="36"
                        height="36"
                        alt=""
                      />
                    </div>
                    <p className="font-medium text-gray-700">{username}</p>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
        {posts.length !== 0 && (
          <section>
            <h2 className="font-bold text-lg text-gray-900 mb-3 px-7">Posts</h2>
            {posts.map((post) => {
              return (
                <Post
                  key={post._id}
                  session={session}
                  post={post}
                  actions={{ baseUrl, query, page }}
                  setPosts={setPosts}
                />
              )
            })}
          </section>
        )}
      </div>
    </MainLayout>
  )
}
