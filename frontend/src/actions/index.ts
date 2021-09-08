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
 * Filter by AVAX
 * @returns {@link Action} to filter by
 */
function setAvax(): Action {
  return {
    type: "AVAX",
  };
}
/**
 * Filter by BTC
 * @returns {@link Action} to filter by
 */
function setBtc(): Action {
  return {
    type: "BTC",
  };
}
/**
 * Filter by ETH
 * @returns {@link Action} to filter by
 */
function setEth(): Action {
  return {
    type: "ETH",
  };
}
/**
 * Filter by LINK
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
