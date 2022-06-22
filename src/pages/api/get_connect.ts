// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next"
import { withSentry } from "@sentry/nextjs"
import { handler } from "../../middleware/connect"

const h = handler().get<NextApiRequest, NextApiResponse>(
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ message: "get connect workers" })
  }
)

export default withSentry(h)
