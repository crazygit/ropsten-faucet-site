// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next"
import { withSentry } from "@sentry/nextjs"
import * as Sentry from "@sentry/nextjs"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  Sentry.setUser({ username: "0x1234567890123456789012345678901234567890" })
  throw new Error("/error api error")
}

export default withSentry(handler)
