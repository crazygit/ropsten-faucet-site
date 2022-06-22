import { createContext, ReactNode, useState } from "react"

export const Web3Context = createContext({
  currentAccount: "",
  setCurrentAccount: (currentAccount: string) => {}
})

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState<string>("")

  return (
    <Web3Context.Provider value={{ currentAccount, setCurrentAccount }}>
      {children}
    </Web3Context.Provider>
  )
}
