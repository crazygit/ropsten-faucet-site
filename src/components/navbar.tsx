import { ethers } from "ethers"
import { useContext } from "react"
import { Web3Context } from "../context/web3conext"
import * as gtag from "../utils/client/gtags"

import {
  providerOptions,
  ropstenNetwork,
  walletTheme
} from "../utils/client/constants"
import Web3Modal from "web3modal"
import { useEffect } from "react"
import { shortenAccountAddress } from "../utils/client/shortenAddress"
import { ProviderRpcError } from "../utils/client/error"
import { logger } from "../utils/logger"
import Link from "next/link"

async function getCurrentAccount() {
  try {
    gtag.event({
      action: "get_current_account",
      category: "event",
      label: "start"
    })
    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    if (accounts.length === 0) {
      return ""
    }
    return accounts[0]
  } catch (e) {
    const error = e as ProviderRpcError
    logger.error("get current account error: %s", error)
    gtag.event({
      action: "get_current_account",
      category: "event",
      label: `failed-${error.code}`
    })
    return ""
  }
}

async function getNetworkVersion() {
  const network = await window.ethereum.request({ method: "net_version" })
  return network
}

// 调用addNetwork成功以后，会自动调用切换网络的方法询问用户是否切换到新加的网络
// 如果添加的网络已经存在，不会有任何处理
async function addNetwork() {
  try {
    logger.info("add network")
    gtag.event({
      action: "add_network",
      category: "event",
      label: "start"
    })
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: ropstenNetwork.chainId,
          chainName: ropstenNetwork.chainName,
          // rpcUrls或blockExplorerUrls数组设置多个值，只会用第一个
          rpcUrls: [ropstenNetwork.rpcUrl],
          blockExplorerUrls: [ropstenNetwork.blockExplorerUrl],
          nativeCurrency: ropstenNetwork.currency
        }
      ]
    })
  } catch (e) {
    // handle "add" error
    const error = e as ProviderRpcError
    logger.error("add chain error: %s", error)
    gtag.event({
      action: "add_network",
      category: "event",
      label: `failed-${error.code}`
    })
  }
}

async function switchNetwork() {
  try {
    logger.info("Ropsten Test Network")
    gtag.event({
      action: "switch_network",
      category: "event",
      label: "start"
    })
    var currentNetwok = await getNetworkVersion()
    if (
      ethers.BigNumber.from(currentNetwok).toHexString() ==
      ropstenNetwork.chainId
    ) {
      logger.info("Already in Ropsten Test Network")
    } else {
      logger.info("switch to Ropsten Test Network: %s", ropstenNetwork.chainId)
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ropstenNetwork.chainId }] // chainId只能是16进制
      })
    }
  } catch (e) {
    // This error code indicates that the chain has not been added to MetaMask.
    const switchError = e as ProviderRpcError
    if (switchError.code === 4902) {
      addNetwork()
    } else {
      // handle other "switch" errors
      gtag.event({
        action: "switch_network",
        category: "event",
        label: `failed-${switchError.code}`
      })
      logger.error("switch chain error: %s", switchError)
    }
  }
}

export default function Navbar() {
  const { currentAccount, setCurrentAccount } = useContext(Web3Context)

  const handleAccountChangeEvent = (accounts: Array<string>) => {
    if (accounts.length > 0) {
      setCurrentAccount(accounts[0])
    } else {
      setCurrentAccount("")
    }
  }
  const bindEvent = () => {
    logger.info("bindEvent")
    if (window.ethereum) {
      window.ethereum.on("connect", (connectInfo: { chainId: string }) => {
        logger.info("MetaMask is connected")
      })

      window.ethereum.on("disconnect", (error: ProviderRpcError) => {
        gtag.event({
          action: "disconnect",
          category: "event",
          label: "disconnect"
        })
        logger.info("MetaMask is disconnected")
      })

      window.ethereum.on("chainChanged", (chainId: string) => {
        logger.info("chainChanged to: %s", chainId)
      })

      window.ethereum.on("accountsChanged", handleAccountChangeEvent)
    }
  }
  const unbindEvent = () => {
    logger.info("unbindEvent")
    if (window.ethereum) {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountChangeEvent
      )
    }
  }

  const checkIfWalletIsConnect = async () => {
    logger.info("call checkIfWalletIsConnect")
    if (!window.ethereum) {
      logger.info("Please install MetaMask.")
      return
    }

    const account = await getCurrentAccount()
    setCurrentAccount(account)
  }

  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      // TODO: Change this to your own network
      network: "ropsten", // optional
      cacheProvider: false, // optional
      // TODO: 暂时只考虑注入式的provider
      // providerOptions, // required
      theme: walletTheme
    })
    // 当设置了cacheProvider为true时，可以通过web3Modal.cachedProvider来清除缓存
    // web3Modal.clearCachedProvider()
    try {
      gtag.event({
        action: "connect_wallet",
        category: "click",
        label: "start"
      })
      const instance = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(instance)
      const account = await getCurrentAccount()
      switchNetwork()
      setCurrentAccount(account)
    } catch (e) {
      const rpcError = e as ProviderRpcError
      gtag.event({
        action: "connect_wallet",
        category: "click",
        label: `failed-${rpcError.code}`
      })
      logger.error(rpcError.message)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnect()
    bindEvent()
    return () => {
      unbindEvent()
    }
  })

  return (
    <nav className="flex flex-row items-start justify-between ">
      <div>
        <h1 className="text-2xl md:text-4xl">
          <Link href="/">Ropsten ETH Faucet</Link>
        </h1>
      </div>
      <div className="hidden items-center justify-center md:flex md:flex-col">
        <button
          type="button"
          className="cursor-pointer rounded-full bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] py-2 px-4 text-xl shadow-[0px_4px_4px_0px_rgba(144,173,204,1)] hover:from-[#3A9AEF] hover:to-[#05D6E0]"
          onClick={connectWallet}
        >
          {currentAccount == ""
            ? "Connect Wallet"
            : shortenAccountAddress(currentAccount)}
        </button>
        {currentAccount == "" && (
          <p className="mt-4 w-full text-sm font-light text-[#425677] opacity-80">
            Tips: connect wallet to auto fill your address
          </p>
        )}
      </div>
    </nav>
  )
}
