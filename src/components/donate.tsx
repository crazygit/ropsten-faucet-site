import { AiFillCopy, AiFillCheckCircle } from "react-icons/ai"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { useState } from "react"
import getConfig from "next/config"
import * as gtag from "../utils/client/gtags"

const { publicRuntimeConfig } = getConfig()
const donateAddress = publicRuntimeConfig.contactAddress

export default function Donate() {
  const [copied, setCopied] = useState<boolean>(false)
  const handleCopy = () => {
    gtag.event({
      action: "copy_donate_address",
      category: "click",
      label: "copy_donate_address"
    })
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 8000)
  }
  return (
    <div className="mx-4 mt-8 grid grid-cols-12 gap-4 md:mx-8">
      <div className="col-span-12 flex flex-col items-center justify-center md:col-span-7 md:col-start-4">
        <h1 className="text-xl">Please Donate</h1>
        <p className="mt-4 px-8 text-sm md:px-2">
          Ropsten ETH has no price, you can donate the excess Ropsten ETH back
          to the faucet to help more people.
        </p>
        <div className="flex items-center justify-center pt-4">
          <address className="break-all text-xs md:text-sm">
            {donateAddress}
            {copied ? (
              <AiFillCheckCircle className="ml-2 md:inline-block text-xl" />
            ) : (
              <CopyToClipboard text={donateAddress} onCopy={handleCopy}>
                <AiFillCopy className="ml-2 hidden cursor-copy md:inline-block text-xl" />
              </CopyToClipboard>
            )}
          </address>
        </div>
      </div>
    </div>
  )
}
