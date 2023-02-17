import axios from "axios"
import { useEffect, useState } from "react"
import encodeUrl from "../utils/encodeUrl"

export default function useScroll(initialPosts, query) {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const baseUrl = "/api/post"

  // fetch posts as user's scrolls the page
  const fetchData = async () => {
    try {
      const url = encodeUrl(baseUrl, { ...query, page })
      const response = await axios.get(url)

      // if there is no more to fetch, setHasMore to false in order for scroll event not running
      if (response.data.posts.length === 0) {
        setHasMore(false)
        return
      }
      setPosts([...posts, ...response.data.posts])
      setPage(page + 1)
    } catch (error) {
      console.error(error)
    }
  }

  // applying scroll event
  useEffect(() => {
    // check first if posts has items and hasMore to true, before running this event
    if (posts.length !== 0 && hasMore) {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }

    // if theres no posts, set hasMore to false and do not run this scroll event anymore
    if (posts.length === 0 && !hasMore) {
      setHasMore(false)
    }

    // calculates the value when user reached the end of the page
    function handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const isAtBottom =
        Math.abs(window.innerHeight + scrollTop - offsetHeight) <= 1

      if (isAtBottom) {
        fetchData()
      }
    }
  }, [posts.length, hasMore])

  // set back to default every time page reloads
  useEffect(() => {
    setHasMore(true)
    setPage(2)
    setPosts(initialPosts)
  }, [initialPosts])

  return { baseUrl, page, posts, setPosts, hasMore }
}
