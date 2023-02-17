import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import { Router } from "next/router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  Router.events.on("routeChangeStart", () => NProgress.start())
  Router.events.on("routeChangeComplete", () => NProgress.done())
  Router.events.on("routeChangeError", () => NProgress.done())

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
