import { toBN } from "web3-utils";

/**
 * Multiplier used to convert milliseconds to seconds
 */
export const MS_TO_SECS = 1000;
/**
 * Multiplier used to convert a number to Solidity representation
 */
export const FLOAT_TO_SOL_NUM = 100000000;
/**
 * Number of deciml decimal places for the predicted price
 */
export const DECIMAL_PLACES = 2;
/**
 * Maximum number of shares available
 */
export const MAX_AVAX_SHARE_PRICE = toBN("20000000000000000");
export const INVALID_PRICE = 0;
export const INVALID_NUM_SHARES = 0;
