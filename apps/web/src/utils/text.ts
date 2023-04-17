export const formatDid = (did: string) => {
  return `${did.slice(8, 12)}...${did.slice(did.length - 4, did.length)}`;
}

export const formatWalletAddress = (address: string, start = 6, end = 4) => {
  if (!address) return "";
  return `${address.slice(0, start)}...${address.slice(-1 * end)}`;
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
