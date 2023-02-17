import Image from "next/image"
import React, { useState } from "react"
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"
import getImageUrl from "../utils/getImageUrl"
import { useSwipeable } from "react-swipeable"
import BlankImage from "../assets/blank-image.png"

export default function Carousel({ images }) {
  const [index, setIndex] = useState(0)
  const translate = (100 / images.length) * index
  const isMultiple = images.length - 1 !== 0

  // prev and next button
  const handleNavigation = (type) => {
    if (type === "prev") {
      if (index === 0) return
      setIndex(index - 1)
    }
    if (type === "next") {
      if (index === images.length - 1) return
      setIndex(index + 1)
    }
  }

  // image swaiper for mobile
  const handlers = useSwipeable({
    onSwipedLeft: () => handleNavigation("next"),
    onSwipedRight: () => handleNavigation("prev"),
  })

  return (
    <div className="relative overflow-hidden">
      <Image
        src={BlankImage}
        alt=""
        width={400}
        height={400}
        className="absolute w-full h-full inset-0"
        priority
      />

      <div
        {...handlers}
        style={{
          transform: `translateX(-${translate}%)`,
          width: `${images.length * 100}%`,
        }}
        className={`relative transition-transform ease-in-out flex`}
      >
        {images.map((image, index) => (
          <div key={index} className="aspect-square w-full h-full">
            <Image
              src={getImageUrl + images[index]}
              alt=""
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      {isMultiple && (
        <>
          {["prev", "next"].map((type) => (
            <button
              key={type}
              type="button"
              className={`${
                type === "prev" ? "left-4" : "right-4"
              } -translate-y-1/2 absolute top-1/2  text-gray-400 text-2xl bg-black/[.25] rounded-full p-2 hover:bg-black/[.30] active:bg-black/[.25]`}
              onClick={() => handleNavigation(type)}
            >
              {type === "prev" ? (
                <AiOutlineLeft className="text-white" />
              ) : (
                <AiOutlineRight className="text-white" />
              )}
            </button>
          ))}
          <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-2 opacity">
            {images.map((image, i) => (
              <div
                key={i}
                className={`${
                  i === index ? "w-3 h-3" : "w-2 h-2"
                } rounded-full bg-black/[.25] transition-all`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
