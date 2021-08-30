export enum Market {
  // eslint-disable-next-line no-magic-numbers
  AVAX = 0,
  BTC,
  ETH,
  LINK,
}

export function marketToString(market: Market): string {
  const names = ["AVAX/USD", "BTC/USD", "ETH/USD", "LINK/USD"];
  return names[market];
}

export enum Vote {
  // eslint-disable-next-line no-magic-numbers
  Yes = 0,
  No,
}

export function menuMarkets(): string[] {
  const ms: string[] = [];

  for (const item in Market) {
    const num = Number(item);
    if (!isNaN(num)) {
      ms.push(marketToString(num));
    }
  }

  return ms;
}
