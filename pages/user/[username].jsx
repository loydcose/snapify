import Image from "next/image"
import { AiOutlineHeart, AiOutlinePlus } from "react-icons/ai"
import { TfiComment } from "react-icons/tfi"
import MainLayout from "../../components/MainLayout"
import Link from "next/link"
import { authOptions } from "../api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth"
import dbConnect from "../../database/dbConnect"
import User from "../../database/models/user"
import Post from "../../database/models/post"
import getImageUrl from "../../utils/getImageUrl"
import StickyBlock from "../../components/StickyBlock.jsx"
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Alert from "../../components/Alert"

export async function getServerSideProps(context) {
  try {
    const { req, res, query } = context
    let session = await unstable_getServerSession(req, res, authOptions)
    let user = null
    await dbConnect()

    if (session) {
      user = await User.findOne({
        _id: session._id,
      })
    }

    // find user base on the query username value
    const authorRes = await User.findOne({ username: query.username })

    //redirects to 404 page if the user not found
    if (!authorRes) {
      return {
        notFound: true,
      }
    }

    // fetch all user's posts
    const posts = await Post.find({ authorId: authorRes._id })

    // combined all the gathered data
    const author = { ...authorRes._doc, posts }
    author.password = undefined

    return {
      props: JSON.parse(
        JSON.stringify({
          user,
          author,
        })
      ),
    }
  } catch (error) {
    console.error(error)
  }
}

const Profile = ({ user, author }) => {
  const router = useRouter()
  const { username, followers, following, image, posts, _id: authorId } = author
  const [isFollowedBtn, setIsFollowedBtn] = useState(false)
  const [loading, setLoading] = useState(false)

  // check if user has followed the author
  const checkFollow = (follower = user) => {
    const isFollowed = follower.following.some((user) => user === authorId)
    setIsFollowedBtn(isFollowed)
  }

  // initial check
  useEffect(() => {
    if (user) {
      checkFollow()
    }
  }, [authorId, user?.following])

  // handle follow click that fetches and do the rechecking
  const handleFollow = async () => {
    if (!user) {
      router.push("/signin")
      return
    }
    setLoading(true)
    try {
      const response = await axios.put(
        `/api/users?type=follow&authorId=${authorId}`
      )
      setLoading(false)
      checkFollow(response.data.user)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <MainLayout>
      <StickyBlock />
      <main className="min-h-[700px] p-7 bg-white shadow-sm rounded-lg">
        <div className="flex items-start gap-4 mb-12">
          <div className="w-[60px] rounded-full overflow-hidden aspect-square">
            <Image
              src={getImageUrl + image}
              alt="avatar"
              width="60"
              height="60"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold md:text-lg">{username}</h2>
            <div className="flex items-center gap-3 flex-wrap  text-gray-600 text-sm md:text-[15px]">
              <p>{followers.length} followers</p>
              <p>{following.length} following</p>
            </div>
          </div>
          {user?._id !== author._id && (
            <button
              type="button"
              className={`${
                loading
                  ? "text-gray-400 bg-gray-100"
                  : "text-blue-600 bg-blue-600/[.10] hover:bg-blue-600/[.15]"
              } flex items-center gap-2 text-sm rounded-lg py-2 px-6 ml-auto font-medium`}
              onClick={handleFollow}
              disabled={loading}
            >
              Follow{isFollowedBtn && "ed"}
            </button>
          )}
        </div>
        <section className="grid grid-cols-2 gap-2 relative">
          {posts.length !== 0 ? (
            posts.map((post) => {
              const { _id, content, likes, comments } = post

              return (
                <Link
                  key={_id}
                  href={`/search?value=${_id}`}
                  className="relative isolate aspect-square overflow-hidden rounded-md"
                >
                  <Image
                    src={getImageUrl + content.images[0]}
                    width="150"
                    height="150"
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-black/[.25] hover:opacity-100 opacity-0 transition-opacity z-10 flex items-center justify-center">
                    <div className="flex text-gray-300 items-center gap-4">
                      <div className="flex items-center gap-2">
                        <AiOutlineHeart className="text-xl" />
                        <span>{likes.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TfiComment />
                        <span>{comments.length}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          ) : (
            <Alert
              message="This user haven't post anything yet"
              className="absolute left-1/2 -translate-x-1/2 text-center"
            />
          )}
        </section>
      </main>
    </MainLayout>
  )
}

export default Profile
