import FeedBtns from "../components/FeedBtns"
import MainLayout from "../components/MainLayout"
import Post from "../components/Post"
import { authOptions } from "./api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth"
import axios from "axios"
import getApiUrl from "../getApiUrl"
import encodeUrl from "../utils/encodeUrl"
import useScroll from "../hooks/useScroll"
import Alert from "../components/Alert"
import StickyBlock from "../components/StickyBlock.jsx"

export async function getServerSideProps(context) {
  try {
    const { req, res, query } = context
    const { feed } = query
    const baseUrl = "/api/post"
    let response = null

    // defaults to foryou feed
    if (!feed) {
      return {
        redirect: {
          destination: "/?feed=foryou",
          permanent: false,
        },
      }
    }

    // fetch posts according to provided queries
    const session = await unstable_getServerSession(req, res, authOptions)
    const options = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie,
      },
    }

    // unsigned user cannot go to protected routes
    if (feed === "following" && !session) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      }
    }

    if (feed) {
      const url = encodeUrl(`${getApiUrl() + baseUrl}`, { feed })
      response = await axios.get(url, options)
    }

    return {
      props: JSON.parse(
        JSON.stringify({
          data: session,
          initialPosts: response.data.posts,
          query,
        })
      ),
    }
  } catch (error) {
    console.error(error)
    return {
      props: JSON.parse(JSON.stringify({ data: {}, initialPosts: [], query })),
    }
  }
}

export default function Home({ data: session, initialPosts, query }) {
  const { baseUrl, page, posts, setPosts, hasMore } = useScroll(
    initialPosts,
    query
  )

  return (
    <MainLayout>
      <StickyBlock />
      <FeedBtns />
      {posts.length === 0 && query.feed === "following" && (
        <Alert type={"noFollowing"} message="You haven't followed anyone yet" />
      )}
      {posts.length === 0 && query.feed === "foryou" && (
        <Alert type={"empty"} message="No posts yet" />
      )}
      <ul className="flex flex-col gap-8 bg-white shadow-sm">
        {posts.length !== 0 &&
          posts.map((post) => {
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
      </ul>
      {/* loading indication */}
      {hasMore && posts.length > 0 && (
        <div className="flex items-center justify-center pt-8">
          <span className="spinner w-[25px] h-[25px] border-[3.8px] border-gray-400"></span>
        </div>
      )}
    </MainLayout>
  )
}
