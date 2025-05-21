export type Token = {
  symbol: string;
  name?: string;
  chainId: string;
  tokenAddress: string;
  priceInUSD: number;
  logoUrl?: string;
  decimals?: number;
};

export enum ChainId {
    Ethereum = "1",
    Polygon = "137",
    Base = "8453",
}

export type SwapDirection = "source | target";
