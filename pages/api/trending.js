import Post from "../../database/models/post"
import dbConnect from "../../database/dbConnect"

export default async function handler(req, res) {
  try {
    await dbConnect()
    const posts = await Post.find()

    // get the top three most used topics
    const topics = posts.map((post) => post.topics).flat()
    const trending = Object.entries(
      topics.reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1
        return acc
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, quantity]) => ({ name, quantity }))
    res.json(trending)
  } catch (error) {
    console.error(error)
  }
}
