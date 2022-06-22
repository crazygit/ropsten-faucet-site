// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next"
import { withSentry } from "@sentry/nextjs"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: "get workers" })
}

export default withSentry(handler)
