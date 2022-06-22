export const shortenAccountAddress = (address: string) =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`

export const shortenTransactionAddress = (address: string) =>
  `${address.slice(0, 15)}...`
