import Head from "next/head"
import Navbar from "./navbar"
import Footer from "./footer"
import { Web3Provider } from "../context/web3conext"
import { QueryClient, QueryClientProvider } from "react-query"
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()
const contactAddress = publicRuntimeConfig.contactAddress

const queryClient = new QueryClient()
export const siteTitle = "Ropsten ETH Faucet"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta charSet="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="robots" content="all" />
          <meta name="description" content="ropsten eth faucet" />
          <meta name="keywords" content="ropsten, eth, faucet" />
          <meta
            name="google-site-verification"
            content="IdzHUdar2Zygh-Yjych2zicNOUqqSy7Aigxcekmt_yM"
          />
        </Head>
        <div className="flex min-h-screen flex-col bg-gradient-to-r from-[#A1C4FD] to-[#C2E9FB] p-8 text-primary">
          <header>
            <Navbar />
          </header>
          <main className="flex-1">{children}</main>
          <footer>
            <Footer contactAddress={contactAddress} />
          </footer>
        </div>
      </QueryClientProvider>
    </Web3Provider>
  )
}
