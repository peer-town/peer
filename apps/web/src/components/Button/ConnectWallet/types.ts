export interface ConnectWalletProps {
  onSessionCreated(address: string): void;
  setDidSession(session: string): void;
  removeDidSession(): void;
}
