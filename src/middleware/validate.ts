import { validationResult, ValidationChain } from "express-validator"
import type { NextApiRequest, NextApiResponse } from "next"
import { NextHandler } from "next-connect"
const validate = (validations: ValidationChain[]) => {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    res.status(400).json({ errors: errors.array() })
  }
}

export default validate
