import { useEffect, useRef, useState } from "react"
import { AiOutlinePlus } from "react-icons/ai"
import { IoMdClose } from "react-icons/io"
import useNew from "../hooks/useNew"
import ImageInput from "./ImageInput"

export default function NewSnap({ className, setDisplayNew }) {
  const inputFilesRef = useRef(null)
  const captionRef = useRef(null)
  const topicsRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState([])
  const maximumFile = 5

  // custom hook for certain actions
  const { handleSubmit, handleAddImage, handleRemoveImage } = useNew({
    captionRef,
    topicsRef,
    imageFiles,
    setImageFiles,
    setLoading,
    maximumFile,
    setDisplayNew,
  })

  useEffect(() => {
    inputFilesRef.current.value = ""
  }, [imageFiles])

  return (
    <div
      className={
        className +
        " z-40 fixed inset-0 bg-black/[.35] items-center justify-center py-6"
      }
    >
      <main className="max-h-full p-7 bg-white w-[90%] max-w-[500px] rounded-lg overflow-auto ">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl tracking-tight">Post snap</h2>
            <button
              type="button"
              onClick={() => setDisplayNew((prev) => !prev)}
              className="border border-gray-300 p-2 rounded-lg hover:bg-gray-100 active:bg-transparent transition-colors"
            >
              <IoMdClose className="text-gray-500 text-lg" />
            </button>
          </div>

          <div className="flex flex-col gap-1 mb-4">
            <label htmlFor="caption" className="text-gray-700 text-sm">
              Caption (max. 500 characters)
            </label>
            <textarea
              ref={captionRef}
              name="caption"
              id="caption"
              rows="4"
              maxLength="500"
              title="Must be 500 characters only"
              placeholder="Enter you caption"
              className="border border-gray-300 focus:ring-1 focus:ring-blue-600 transition outline-none p-3 rounded-md text-sm"
            ></textarea>
          </div>

          {/* image input */}
          <div className="flex flex-col mb-4 gap-1">
            <label htmlFor="images" className="text-gray-700 text-sm">
              Attach image (max. {maximumFile})
            </label>

            <div className="flex item-center gap-1 flex-wrap">
              {imageFiles !== 0 &&
                imageFiles.map((image, index) => {
                  return (
                    <ImageInput
                      key={index}
                      index={index}
                      image={image}
                      handleRemoveImage={handleRemoveImage}
                    />
                  )
                })}
            </div>
            <div
              className={` border relative focus-within:ring-1 focus-within:ring-blue-600 transition border-gray-300 rounded-md items-center justify-center h-[150px] ${
                imageFiles.length < maximumFile ? "flex" : "hidden"
              }`}
            >
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                ref={inputFilesRef}
                onChange={handleAddImage}
                className="absolute inset-0 opacity-0 outline-none "
              />
              <div>
                <AiOutlinePlus className="text-blue-600 mx-auto" />
                <span className="text-sm text-gray-700">Upload an image</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-6 gap-1">
            <label htmlFor="topics" className="text-gray-700 text-sm">
              Topics (comma separated)
            </label>
            <input
              ref={topicsRef}
              type="text"
              id="topics"
              name="topics"
              placeholder="developer, programming"
              pattern="^([a-zA-Z0-9]+[,\s]*){1,20}$"
              title="Comma separated, maximum of 20 topics"
              className="border border-gray-300 p-2 focus:ring-1 focus:ring-blue-600 transition outline-none rounded-md text-sm"
            />
          </div>

          <button
            type="submit"
            className={`${
              loading
                ? "pointer-events-none bg-gray-100 text-gray-400"
                : "pointer-events-auto bg-blue-600 text-white"
            } flex items-center gap-2 justify-center rounded-full py-2 px-6 transition-colors focus:ring outline-none  w-full max-w-[200px] hover:bg-blue-700 text-sm`}
            disabled={loading}
          >
            <span className="text-semibold">Post snap</span>
          </button>
        </form>
      </main>
    </div>
  )
}
