import Head from "next/head"
import { Layout, ErrorMessage } from "../components"
import { siteTitle } from "../components/layout"

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ErrorMessage message="Opps, Server Error!" />
    </Layout>
  )
}
