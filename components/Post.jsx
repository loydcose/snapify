import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { MdSend } from "react-icons/md"
import { TfiComment } from "react-icons/tfi"
import Carousel from "./Carousel"
import getImageUrl from "../utils/getImageUrl"
import moment from "moment"
import axios from "axios"
import Link from "next/link"
import usePost from "../hooks/usePost"

export default function Post({ session, post, actions, setPosts }) {
  const {
    _id: postId,
    authorId,
    author,
    topics,
    content: { caption, images },
    likes,
    comments,
    createdAt,
  } = post
  const { image, username } = author

  const [followBtnStyle, setFollowBtnStyle] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const commentRef = useRef(null)
  const [showComments, setShowComments] = useState(false)
  const [commentDisplay, setCommentDisplay] = useState(3)
  const limitedComments = comments.slice(0, commentDisplay)

  // handles certain actions
  const { handleFollow, handleLike, handleComment } = usePost(
    session,
    commentRef,
    authorId,
    postId,
    actions,
    setPosts
  )

  // setting like button style
  useEffect(() => {
    if (!session) {
      setIsLiked(false)
      return
    }
    const liked = likes.some((like) => like === session._id)
    setIsLiked(liked)
  }, [likes, session])

  // set follow btn style
  useEffect(() => {
    if (!session) {
      setFollowBtnStyle(false)
      return
    }

    const getStatus = async () => {
      const response = await axios.get(`/api/users/${session._id}`)
      const hasFollowed = response.data.user.following.some(
        (id) => id === authorId
      )
      setFollowBtnStyle(hasFollowed)
    }
    getStatus()
  }, [post])

  return (
    <div className="mt-4">
      <div className="px-4 md:px-7">
        <div className="justify-between flex items-start mb-3">
          <div className="flex gap-2 items-center">
            <div className="aspect-square overflow-hidden w-[40px] rounded-full border border-gray-300">
              <Image
                src={getImageUrl + image}
                alt="avatar"
                width="40"
                height="40"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <Link
                href={`/user/${username}`}
                className="font-bold text-sm md:text-[15px] hover:text-blue-600 transition-colors"
              >
                {username}
              </Link>
              <p className="text-sm text-gray-400">
                {moment(createdAt).fromNow()}
              </p>
            </div>
          </div>
          {authorId !== session?._id && (
            <button
              type="button"
              onClick={handleFollow}
              className={`text-blue-600 font-medium bg-blue-600/[.10] hover:bg-blue-600/[.20] py-2 px-4 text-sm rounded-lg transition-colors`}
            >
              Follow{followBtnStyle && "ed"}
            </button>
          )}
        </div>
        <p className="mb-2 text-[15px] text-gray-600">{caption}</p>
        <div className="flex gap-2 mb-2">
          {topics !== 0 &&
            topics.map((topic, index) => {
              return (
                <Link
                  href={`/search?value=${topic}`}
                  key={index}
                  className="text-blue-600 text-[15px] hover:underline"
                >
                  #{topic}
                </Link>
              )
            })}
        </div>
      </div>
      <Carousel images={images} />
      <div className="px-7">
        <div className="flex items-center mb-2 gap-4 py-4">
          <button
            type="button"
            onClick={handleLike}
            className="group flex text-[15px] items-center gap-2"
          >
            {isLiked ? (
              <AiFillHeart className="text-xl text-gray-500 group-hover:text-blue-600 transition-colors" />
            ) : (
              <AiOutlineHeart className="text-xl text-gray-500 group-hover:text-blue-600 transition-colors" />
            )}

            <span className="text-sm md:text-[15px] text-gray-700 group-hover:text-blue-600 transition-colors">
              {likes.length} Like{likes.length > 1 && "s"}
            </span>
          </button>
          <button
            type="button"
            className="group flex items-center text-[15px] gap-2 text-gray-700   hover:text-blue-600 transition-colors"
            onClick={() => setShowComments(!showComments)}
          >
            <TfiComment className="text-gray-500 group-hover:text-blue-600 transition-colors" />
            <span className="text-sm md:text-[15px] text-gray-700 group-hover:text-blue-600 transition-colors">
              {comments.length} Comment{comments.length > 1 && "s"}
            </span>
          </button>
        </div>

        {/* comment block */}
        <div className={`${showComments ? "block" : "hidden"}`}>
          {limitedComments !== 0 &&
            limitedComments.map((item) => {
              const {
                _id,
                commenterId,
                commenter: { username, image },
                comment,
                createdAt,
              } = item
              return (
                <div key={_id} className="flex items-start gap-2 mb-4">
                  <div className="aspect-square overflow-hidden w-[45px] rounded-full">
                    <Image
                      src={getImageUrl + image}
                      alt=""
                      className="w-full h-full object-cover"
                      width="45"
                      height="45"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex gap-4 justify-between">
                      <Link
                        href={`/user/${username}`}
                        className="font-bold hover:text-blue-600 transition-colors text-sm md:text-[15px]"
                      >
                        {username}
                      </Link>
                      <span className="text-sm text-gray-400">
                        {moment(createdAt).fromNow()}
                      </span>
                    </div>
                    <p className="text-sm md:text-[15px] text-gray-600">
                      {comment}
                    </p>
                  </div>
                </div>
              )
            })}

          {/* show more button */}
          {commentDisplay < comments.length && (
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setCommentDisplay(commentDisplay + 3)}
            >
              Show more
            </button>
          )}

          {/* comment input */}
          <form
            onSubmit={handleComment}
            className="border mt-4 justify-between flex items-center rounded-lg px-2 border-gray-200 focus-within:ring-1 transition focus-within:ring-blue-700 overflow-hidden mb-6"
          >
            <input
              type="text"
              placeholder="Add comment"
              maxLength="64"
              ref={commentRef}
              required
              className="p-3 min-w-0 grow outline-none text-sm text-gray-700"
            />
            <button
              type="submit"
              className="rounded-md p-2 w-8 hover:bg-gray-200 aspect-square transition-colors"
            >
              <MdSend className="text-lg text-blue-600" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
