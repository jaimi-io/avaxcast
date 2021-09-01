export function lightOff(): Action {
  return {
    type: "LIGHT OFF",
  };
}

export function lightOn(): Action {
  return {
    type: "LIGHT ON",
  };
}

function setAvax(): Action {
  return {
    type: "AVAX",
  };
}

function setBtc(): Action {
  return {
    type: "BTC",
  };
}

function setEth(): Action {
  return {
    type: "ETH",
  };
}

function setLink(): Action {
  return {
    type: "LINK",
  };
}

function setAll(): Action {
  return {
    type: "ALL",
  };
}

export const filterMarketActions = [setAvax, setBtc, setEth, setLink, setAll];
