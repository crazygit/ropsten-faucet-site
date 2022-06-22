import nc, { Middleware } from "next-connect"
import type { NextApiRequest, NextApiResponse } from "next"

import * as Sentry from "@sentry/nextjs"
import { logger } from "../utils/logger"
// when u call this its ONLY run in post request
const post = (middleware: Middleware<NextApiRequest, NextApiResponse>) => {
  return nc().post(middleware)
}

// u can customize where your validator runs
// for example u can use this for validate your PUT request :
// const put = (middleware) => {
//     return nc().put(middleware)
// }

// u can set onError , onNoMatch and global middleware or etc
//  handler = nextConnect({ onError, onNoMatch }).use(SOME_MIDDLEWARE)
const handler = () => {
  return nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      logger.error(err.stack)
      // 使用connect middleware后，由于被connect处理了异常，导致服务端报错时
      // sentry无法捕获错误信息, 暂时在此处手动提交错误
      Sentry.captureException(err)
      res.status(500).json({ message: "Server error!", success: false })
    },
    onNoMatch: (req, res) => {
      res.status(404).json({ message: "Api not found", success: false })
    }
  })
}

// Dont forget to use export your PUT middleware or other
export { handler, post }
