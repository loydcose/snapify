import { useRouter } from "next/router"
import axios from "axios"
import actionFetch from "../utils/actionFetch"
import { useState } from "react"

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
  const [loading, setLoading] = useState({
    follow: false,
    like: false,
    comment: false,
  })

  const handleFollow = async () => {
    if (!session) {
      router.push("/signin")
      return
    }
    setLoading({ ...loading, follow: true })
    try {
      const response = await axios.put(
        `/api/users?type=follow&authorId=${authorId}`
      )
      const posts = await actionFetch(baseUrl, query, page)
      setLoading({ ...loading, follow: false })
      setPosts(posts)
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleComment = async (e) => {
    try {
      e.preventDefault()
      if (!session) {
        router.push("/signin")
        return
      }
      const { value } = commentRef.current
      setLoading({ ...loading, comment: true })
      const response = await axios.put(`/api/post/${postId}?type=comment`, {
        comment: value,
      })
      commentRef.current.value = ""
      const posts = await actionFetch(baseUrl, query, page)
      setLoading({ ...loading, comment: false })
      setPosts(posts)
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleLike = async () => {
    try {
      !session && router.push("/signin")
      setLoading({ ...loading, like: true })
      const response = await axios.put(`/api/post/${postId}?type=like`)
      const posts = await actionFetch(baseUrl, query, page)
      setLoading({ ...loading, like: false })
      setPosts(posts)
    } catch (error) {
      console.error(error.message)
    }
  }

  return { loading, handleFollow, handleLike, handleComment }
}
