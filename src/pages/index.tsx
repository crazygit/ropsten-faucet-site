import Head from "next/head"
import { Layout, Faucet, Donate } from "../components"
import { siteTitle } from "../components/layout"
import { logger } from "../utils/logger"

export default function Home() {
  logger.info("App Deploy with NODE_ENV: %s", process.env.NODE_ENV)

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Faucet />
      <Donate />
    </Layout>
  )
}
