const fetchPosts = async (arr, User) => {
  return await Promise.all(
    arr.map(async (post) => {
      const author = await User.findOne({ _id: post.authorId })
      author.password = undefined

      const comments = await Promise.all(
        post.comments.map(async (comment) => {
          const commenter = await User.findOne({ _id: comment.commenterId })
          commenter.password = undefined

          return { ...comment._doc, commenter }
        })
      )

      const sortedComments = comments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )

      return { ...post._doc, author, comments: sortedComments }
    })
  )
}

export default fetchPosts
