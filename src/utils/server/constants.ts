import WalletConnectProvider from "@walletconnect/web3-provider"
import { ethers } from "ethers"

import getConfig from "next/config"

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

// add this in your tsconfig.json file:
// {
//   "compilerOptions": {
//     "resolveJsonModule": true
//   }
// }
import { default as abi } from "./abi.json"

const provider =
  process.env.NODE_ENV == "production"
    ? new ethers.providers.InfuraProvider("ropsten", {
        projectId: publicRuntimeConfig.infuraProjectId,
        projectSecret: serverRuntimeConfig.infuraProjectSecret
      })
    : new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/", {
        name: "localhost",
        chainId: 31337
      })
const faucetContractOwner = new ethers.Wallet(
  serverRuntimeConfig.contractOwnerPrivateKey,
  provider
)

export const faucetContract = new ethers.Contract(
  publicRuntimeConfig.contactAddress,
  abi,
  faucetContractOwner
)
