import faucetImage from "../../public/images/faucet.svg"
import Image from "next/image"
import { Web3Context } from "../context/web3conext"
import { useContext, useEffect, useRef } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { ethers } from "ethers"
import { AiFillWarning } from "react-icons/ai"
import axios, { AxiosError } from "axios"
import { useMutation } from "react-query"
import { getErrorMessage } from "../utils/client/error"
import BlankA from "./blank_a"
import { shortenTransactionAddress } from "../utils/client/shortenAddress"
import * as gtag from "../utils/client/gtags"
import getConfig from "next/config"
import HCaptcha from "@hcaptcha/react-hcaptcha"

const { publicRuntimeConfig } = getConfig()
const receiverRegisterName = "receiver"

export default function Faucet() {
  type Inputs = {
    receiver: string
    captcha: string
  }

  const { currentAccount } = useContext(Web3Context)
  const hcaptchaRef = useRef<HCaptcha>(null)
  const mutation = useMutation(
    (body: Inputs) => {
      return axios.post("/api/withdraw", body)
    },
    {
      onError: (error, variables, context) => {
        gtag.event({
          action: "withdraw",
          category: "click",
          label: "failed"
        })
      },
      onSuccess: (data, variables, context) => {
        gtag.event({
          action: "withdraw",
          category: "click",
          label: "success"
        })
      }
    }
  )

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<Inputs>({
    mode: "onSubmit",
    reValidateMode: "onChange"
  })

  const onSubmit: SubmitHandler<Inputs> = (inputs) => {
    gtag.event({
      action: "withdraw",
      category: "click",
      label: "start"
    })
    hcaptchaRef.current?.execute()
  }

  function handleVerificationSuccess(token: string, _ : string) {
    gtag.event({
      action: "captcha",
      category: "event",
      label: "client_success"
    })
    mutation.mutate({
      captcha: token,
      receiver: getValues(receiverRegisterName)
    })
  }

  useEffect(() => {
    // 当currentAccount值发生变化时，设置下reciever的值
    // 避免第一次验证失败
    if (currentAccount) {
      setValue(receiverRegisterName, currentAccount)
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-4 grid grid-cols-12 gap-4 md:mx-8">
        <div className="hidden md:col-span-2 md:col-start-2 md:block">
          <Image
            src={faucetImage}
            alt="faucet"
            className="relative lg:-right-[100px]"
          />
        </div>
        <div className="col-span-12 mt-8 flex h-full flex-col items-center justify-end md:col-span-7">
          <h2 className="text-xl md:text-3xl">Enter Your Ropsten Address</h2>
          <input
            type="input"
            placeholder="0x......"
            defaultValue={currentAccount}
            {...register(receiverRegisterName, {
              required: "Please enter your ropsten address.",
              validate: (value) =>
                ethers.utils.isAddress(value) || "Invalid address format."
            })}
            className={`first-line:bg-color-none mt-8 h-10 w-full rounded-lg border-2  bg-transparent text-center outline-none ${
              errors.receiver
                ? "border-red-500 focus:border-red-500"
                : "border-[#69ADFF] focus:border-[#528dd4]"
            }`}
          />
          {errors.receiver && (
            <span className="mt-2 text-sm text-red-500">
              <AiFillWarning className="inline" />
              &nbsp;
              {errors.receiver.message}
            </span>
          )}
        </div>
        <div className="col-span-12 mt-8 flex items-center justify-center md:col-span-7 md:col-start-4">
          <input
            type="submit"
            value="Give me Ropsten ETH"
            disabled={mutation.isLoading}
            className={`rounded-full bg-gradient-to-r from-[#9EFBD3] via-[#57E9F2] to-[#45D4FB] px-4 py-2 text-xl shadow-[0px_4px_4px_0px_rgba(144,173,204,1)] hover:from-[#78cca7] hover:via-[#3ebbc2] hover:to-[#26A3C5] ${
              mutation.isLoading ? "cursor-wait" : "cursor-pointer"
            }`}
          />
          <HCaptcha
            sitekey={publicRuntimeConfig.hcaptchaSiteKey}
            onVerify={handleVerificationSuccess}
            size="invisible"
            ref={hcaptchaRef}
          />
        </div>

        {mutation.isError && (
          <div className="col-span-12 mt-4 flex items-center justify-center md:col-span-7 md:col-start-4">
            Opps, An error occurred:{" "}
            {getErrorMessage(mutation.error as AxiosError)}
            <br />
            Please try again later!
          </div>
        )}

        {mutation.isSuccess && (
          <div className="col-span-12 mt-2 flex items-center justify-center md:col-span-7 md:col-start-4 text-base">
            <div className="flex-col items-center justify-center">
              <p>Congratulations! You have successfully acquired some ETH.</p>
              <p>
                Please check your wallet in a few minutes, Or you can see the
                transaction process from:
              </p>
              <p className="mt-2 text-center">
                <BlankA
                  className="text-blue-600 no-underline hover:underline"
                  href={`https://ropsten.etherscan.io/tx/${mutation.data.data.transaction_hash}`}
                >
                  {shortenTransactionAddress(
                    mutation.data.data.transaction_hash
                  )}
                </BlankA>
              </p>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
