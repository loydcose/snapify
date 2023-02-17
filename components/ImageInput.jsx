import Image from "next/image"
import React from "react"
import { IoMdClose } from "react-icons/io"

export default function ImageInput({ index, image, handleRemoveImage }) {
  return (
    <div
      key={index}
      className="w-[60px] aspect-square rounded-lg overflow-hidden border border-gray-300 relative"
    >
      <button
        type="button"
        onClick={() => handleRemoveImage(index)}
        className="opacity-0 hover:opacity-100 transition-opacity absolute inset-0 flex bg-black/[.25]"
      >
        <IoMdClose className="text-white m-auto text-2xl" />
      </button>
      <Image
        src={URL.createObjectURL(image)}
        alt={image.name}
        width="60"
        height="60"
        className="h-full w-full object-contain"
      />
    </div>
  )
}
