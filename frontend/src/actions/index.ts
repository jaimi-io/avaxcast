/**
 * Turns dark mode on
 * @returns {@link Action} to turn dark mode on
 */
export function lightOff(): Action {
  return {
    type: "LIGHT OFF",
  };
}

/**
 * Turns dark mode off
 * @returns {@link Action} to turn dark mode off
 */
export function lightOn(): Action {
  return {
    type: "LIGHT ON",
  };
}

/**
 * Used to display the buffer icon
 * @returns {@link Action} to indicate data is loading
 */
export function isLoading(): Action {
  return {
    type: "LOADING",
  };
}

/**
 * Used to hide the buffer icon
 * @returns {@link Action} to indicate data is finished loading
 */
export function notLoading(): Action {
  return {
    type: "NOT LOADING",
  };
}

/**
 * Filter by {@link Market.AVAX}
 * @returns {@link Action} to filter by
 */
function setAvax(): Action {
  return {
    type: "AVAX",
  };
}
/**
 * Filter by {@link Market.BTC}
 * @returns {@link Action} to filter by
 */
function setBtc(): Action {
  return {
    type: "BTC",
  };
}
/**
 * Filter by {@link Market.ETH}
 * @returns {@link Action} to filter by
 */
function setEth(): Action {
  return {
    type: "ETH",
  };
}
/**
 * Filter by {@link Market.LINK}
 * @returns {@link Action} to filter by
 */
function setLink(): Action {
  return {
    type: "LINK",
  };
}
/**
 * Filter by any {@link Market}
 * @returns {@link Action} to filter by
 */
function setAll(): Action {
  return {
    type: "ALL",
  };
}

/**
 * List of all {@link Action}s for the {@link Market} filter
 */
export const filterMarketActions = [setAvax, setBtc, setEth, setLink, setAll];
