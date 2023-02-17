import { useRouter } from "next/router"
import axios from "axios"
import actionFetch from "../utils/actionFetch"

export default function usePost(
  session,
  commentRef,
  authorId,
  postId,
  actions,
  setPosts
) {
  const router = useRouter()
  const { baseUrl, query, page } = actions

  const handleFollow = async () => {
    if (!session) {
      router.push("/signin")
      return
    }
    try {
      const response = await axios.put(
        `/api/users?type=follow&authorId=${authorId}`
      )
      const posts = await actionFetch(baseUrl, query, page)
      setPosts(posts)
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleComment = async (e) => {
    try {
      e.preventDefault()
      !session && router.push("/signin")

      const { value } = commentRef.current
      const response = await axios.put(`/api/post/${postId}?type=comment`, {
        comment: value,
      })
      commentRef.current.value = ""
      const posts = await actionFetch(baseUrl, query, page)
      setPosts(posts)
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleLike = async () => {
    try {
      !session && router.push("/signin")
      const response = await axios.put(`/api/post/${postId}?type=like`)
      const posts = await actionFetch(baseUrl, query, page)
      setPosts(posts)
    } catch (error) {
      console.error(error.message)
    }
  }

  return { handleFollow, handleLike, handleComment }
}
