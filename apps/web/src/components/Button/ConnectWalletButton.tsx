import {useWeb3Modal} from '@web3modal/react';
import {useState} from 'react';
import {useAccount, useDisconnect} from 'wagmi';

export const ConnectWalletButton = () => {
  const {open} = useWeb3Modal()
  const {disconnect} = useDisconnect()
  const {isConnected, address} = useAccount()
  const [loading, setLoading] = useState(false)

  const onOpen = async () => {
    setLoading(true)
    await open()
    setLoading(false)
  }

  const onClick = async () => {
    isConnected ? disconnect() : await onOpen()
  }

  return (
    <button
      className="flex h-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-2 text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      onClick={onClick}
      disabled={loading}>
      { isConnected ? address.slice(0, 8) + "..." : "Connect Wallet"}
    </button>
  )
}
