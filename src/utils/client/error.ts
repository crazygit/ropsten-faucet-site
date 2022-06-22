import { AxiosError } from "axios"

export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export function getErrorMessage(error: AxiosError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.data?.errors) {
      return error.response.data.errors[0].msg
    }
    return error.response.statusText || "Server error"
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return "No response from server"
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message
  }
}
