import WalletConnectProvider from "@walletconnect/web3-provider"
import { ethers } from "ethers"

import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

export const providerOptions = {
  // 这里可以添加更多钱包的配置，具体看官方文档
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      // TODO: 使用环境变量配置infuraId
      infuraId: publicRuntimeConfig.infuraProjectId // required
    }
  }
}

export const walletTheme = {
  background: "rgb(246, 248, 251)",
  main: "rgb(30, 59, 114)",
  secondary: "rgb(95, 163, 242)",
  border: "rgba(161, 196, 253, 0.2)",
  hover: "rgba(161, 196, 253, 1.0)"
}

export const ropstenNetwork = {
  chainName: "Ropsten Test Network",
  chainId: ethers.utils.hexValue(ethers.BigNumber.from("3")),
  rpcUrl: "https://ropsten.infura.io/v3/",
  blockExplorerUrl: "https://ropsten.etherscan.io",
  currency: {
    name: "ETH",
    symbol: "ETH", // 2-6 characters long
    decimals: 18
  }
}
