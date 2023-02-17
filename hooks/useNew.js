import toast from "react-hot-toast"
import axios from "axios"

export default function useNew  (props)  {
  const {
    captionRef,
    topicsRef,
    imageFiles,
    setImageFiles,
    setLoading,
    maximumFile,
    setDisplayNew,
  } = props

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      // must have at least 1 image
      if (!imageFiles.length) {
        toast.error("Please select one or more files")
        return
      }
      toast.loading("Posting...")
      setLoading(true)

      // converting images to base64 & topics to array before fetching
      const { value: caption } = captionRef.current
      const { value: topics } = topicsRef.current
      const topicsArr = !topics.trim()
        ? []
        : topics.split(" ").join("").split(",")
      const base64Images = await Promise.all(
        imageFiles.map((image) => {
          return new Promise((resolve) => {
            let baseURL = ""
            let reader = new FileReader()
            reader.readAsDataURL(image)
            reader.onload = () => {
              baseURL = reader.result
              resolve(baseURL)
            }
          })
        })
      )

      // fetch data along with the object
      const postData = { caption, topics: topicsArr, images: base64Images }
      const response = await axios.post(`/api/post/`, postData)
      setLoading(false)
      toast.dismiss()
      const { success, message } = response.data
      if (success) {
        toast.success(message)

        // changing the form inputs back to their empty defaults
        captionRef.current.value = ""
        topicsRef.current.value = ""
        setImageFiles([])
        setDisplayNew(false)
      } else {
        toast.error(message)
      }
    } catch (error) {
      toast.error("There was an error")
      console.error(error.message)
    }
  }

  const handleAddImage = (e) => {
    const { files } = e.currentTarget
    // only five images are allowed
    const isOverMax = imageFiles.length + files.length > maximumFile
    if (isOverMax) {
      toast.error(`Maximum of ${maximumFile} images only`)
      return
    }
    setImageFiles([...imageFiles, ...files])
  }

  const handleRemoveImage = (index) => {
    const newImages = imageFiles.filter((image, i) => i !== index)
    setImageFiles([...newImages])
  }

  return { handleSubmit, handleAddImage, handleRemoveImage }
}

