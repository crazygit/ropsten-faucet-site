// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ethers } from "ethers"
import { check } from "express-validator"
import type { NextApiRequest, NextApiResponse } from "next"
import validateMiddleware from "../../middleware/validate"
import { withSentry } from "@sentry/nextjs"
import initMiddleware from "../../utils/server/init-middleware"
import { faucetContract } from "../../utils/server/constants"
import getConfig from "next/config"
import * as Sentry from "@sentry/nextjs"
import { logger } from "../../utils/logger"
import { ProviderRpcError } from "../../utils/client/error"
import axios, { AxiosRequestConfig } from "axios"
import qs from "qs"
const { serverRuntimeConfig } = getConfig()

const postValidator = initMiddleware(
  validateMiddleware([
    check("receiver")
      .notEmpty()
      .withMessage("receiver can't be empty")
      .bail()
      .custom((value) => {
        if (!ethers.utils.isAddress(value)) {
          throw new Error("Invalid address")
        }
        return true
      }),
    check("captcha")
      .notEmpty()
      .withMessage("captcha can't be empty")
      .bail()
      .custom(async (value) => {
        try {
          const response = await axios({
            url: "https://hcaptcha.com/siteverify",
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            data: qs.stringify({
              response: value,
              secret: serverRuntimeConfig.hcaptchaSecretKey
            })
          })
          if (response.data.success) {
            return true
          }
          logger.error(response.data)
          throw new Error("Invalid captcha")
        } catch (error) {
          logger.error(error)
          throw new Error("Invalid captcha")
        }
      })
  ])
)

type ExtendedRequest = NextApiRequest & {
  body: {
    receiver: string
    captcha: string
  }
}

async function handler(req: ExtendedRequest, res: NextApiResponse) {
  await postValidator(req, res)
  Sentry.setUser({ username: req.body.receiver })
  try {
    const transaction = await faucetContract.withDraw(
      req.body.receiver,
      ethers.utils.parseEther(serverRuntimeConfig.withdrawETHAmountEveryTime)
    )
    logger.info(`submit tx: ${transaction.hash}, address: ${req.body.receiver}`)
    res.status(200).json({
      success: true,
      transaction_hash: transaction.hash
    })
  } catch (e) {
    const switchError = e as ProviderRpcError
    logger.error(e)
    res.status(500).json({
      success: false,
      error: switchError
    })
  }
}

export default withSentry(handler)
