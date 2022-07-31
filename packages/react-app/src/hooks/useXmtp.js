import { createContext, useContext } from 'react'
import { XmtpContext } from '../contexts/xmtp'

export const XmtpContext = createContext({
    wallet: undefined,
    walletAddress: undefined,
    client: undefined,
    conversations: [],
    loadingConversations: false,
    getMessages: () => [],
    connect: () => undefined,
    disconnect: () => undefined,
  })


const useXmtp = () => {

  const context = useContext(XmtpContext)
  if (context === undefined) {
    throw new Error('useXmtp must be used within an XmtpProvider')
  }
  return context
}

export default useXmtp
