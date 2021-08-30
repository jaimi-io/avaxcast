export enum Market {
  // eslint-disable-next-line no-magic-numbers
  AVAX = 0,
  BTC,
  ETH,
  LINK,
}

export const marketNames = ["AVAX/USD", "BTC/USD", "ETH/USD", "LINK/USD"];

export function marketToString(market: Market): string {
  return marketNames[market];
}

export enum Vote {
  // eslint-disable-next-line no-magic-numbers
  Yes = 0,
  No,
}
