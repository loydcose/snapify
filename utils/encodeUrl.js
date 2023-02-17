const encodeUrl = (url, queries = {}) => {
  const queryString = Object.entries(queries)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&")

  if (!queryString) {
    return encodeURI(url)
  }

  return `${encodeURI(url)}?${queryString}`
}

export default encodeUrl
