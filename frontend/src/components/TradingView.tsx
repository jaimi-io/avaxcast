import { Market } from "common/enums";
import { marketNames } from "common/markets";
import { useAppSelector } from "hooks";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { memo } from "react";

interface PropsT {
  market: Market;
}

/**
 * Trading view graph widget
 * @param props - {@link PropsT}
 * @returns The TradingView Component
 */
function TradingView({ market }: PropsT): JSX.Element {
  if (market === Market.ALL) {
    return <></>;
  }
  const isDark = useAppSelector((state) => state.isDark);
  const updatedName = marketNames[market].replace("/", "");
  return (
    <AdvancedRealTimeChart
      theme={isDark ? "dark" : "light"}
      symbol={`BINANCE:${updatedName}`}
      interval="60"
    />
  );
}

export default memo(TradingView);
