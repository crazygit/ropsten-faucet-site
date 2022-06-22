import Head from "next/head"
import { Layout, ErrorMessage } from "../components"
import { siteTitle } from "../components/layout"

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <ErrorMessage message="404 - Page Not Found" />
    </Layout>
  )
}
