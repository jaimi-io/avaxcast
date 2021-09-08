import { Market } from "common/enums";

/**
 * Reducer for the {@link Market} filter
 * @param state - Current state
 * @param action - Action to be carried out
 * @returns The chosen {@link Market} to filter by
 */
function marketFilterReducer(state = Market.ALL, action: Action): Market {
  switch (action.type) {
    case "AVAX":
      return Market.AVAX;
    case "BTC":
      return Market.BTC;
    case "ETH":
      return Market.ETH;
    case "LINK":
      return Market.LINK;
    case "ALL":
      return Market.ALL;
    default:
      return state;
  }
}

export default marketFilterReducer;
