import {
  AiFillCopyrightCircle,
  AiFillTwitterCircle,
  AiFillGithub,
  AiFillMail
} from "react-icons/ai"
import { FaFileContract } from "react-icons/fa"
import BlankA from "./blank_a"

export default function Footer({ contactAddress }: { contactAddress: string }) {
  return (
    <div className="mx-4 mt-4 md:mx-8">
      <hr />
      <div className="mt-4 flex items-center justify-center space-x-2 text-base">
        <span>
          <AiFillCopyrightCircle className="inline" />
          &nbsp;2022 crazygit
        </span>
        <BlankA href="https://twitter.com/lianglin999">
          <AiFillTwitterCircle className="inline cursor-pointer" />
        </BlankA>
        <BlankA href="https://github.com/crazygit">
          <AiFillGithub className="inline cursor-pointer" />
        </BlankA>
        <BlankA href={`https://ropsten.etherscan.io/address/${contactAddress}`}>
          <FaFileContract className="inline cursor-pointer" />
        </BlankA>
        <BlankA href="mailto:support@wiseturtles.com?subject=Ropsten Faucet&body=Any suggestion to this site?">
          <AiFillMail className="inline cursor-pointer" />
        </BlankA>
      </div>
    </div>
  )
}
