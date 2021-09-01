import AvaxLogo from "images/avalanche-avax-logo.svg";
import BtcLogo from "images/bitcoin.svg";
import EthLogo from "images/ethereum.svg";
import LinkLogo from "images/link.svg";
import CryptoLogo from "images/crypto.svg";

export enum Market {
  // eslint-disable-next-line no-magic-numbers
  AVAX = 0,
  BTC,
  ETH,
  LINK,
  ALL,
}

export const marketNames = [
  "AVAX/USD",
  "BTC/USD",
  "ETH/USD",
  "LINK/USD",
  "ALL MARKETS",
];
export const marketIcons = [AvaxLogo, BtcLogo, EthLogo, LinkLogo, CryptoLogo];

export enum Vote {
  // eslint-disable-next-line no-magic-numbers
  Yes = 0,
  No,
}
