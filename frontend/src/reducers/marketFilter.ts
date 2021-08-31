import { Market } from "common/markets";

function marketFilterReducer(state = Market.AVAX, action: Action): Market {
  switch (action.type) {
    case "AVAX":
      return Market.AVAX;
    case "BTC":
      return Market.BTC;
    case "ETH":
      return Market.ETH;
    case "LINK":
      return Market.LINK;
    default:
      return state;
  }
}

export default marketFilterReducer;
