import Image from "next/image"
import Logo from "/public/logo.svg"
import Background from "../assets/background.jpg"

export default function AuthLayout({ children }) {
  return (
    <header className="min-h-screen flex">
      <section className="md:mx-[5%] mx-auto w-[90%] max-w-[400px] md:min-w-[320px]">
        <Image src={Logo} alt="" className="mb-16 mt-8" priority/>
        {children}
      </section>
      <div className="grow hidden md:block">
        <Image src={Background} alt="" className="w-full h-full object-cover" />
      </div>
    </header>
  )
}

// polish more and final designs
