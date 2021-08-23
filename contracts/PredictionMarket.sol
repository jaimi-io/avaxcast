pragma solidity ^0.8.7;

/** @title Prediction Market Contract
 *  @notice Prediction markets for cryptocurrency pairs
 *  @author Jaimi Patel
 */
contract PredictionMarket {
  /**
   * @notice Enum of possible currency prediction markets
   */
  enum Market {
    AvaxUsd,
    BtcUsd,
    EthUsd,
    LinkUsd
  }

  /**
   * @notice Current currency prediction market
   */
  Market public market;

  /**
   * @notice Construct a new prediction market
   */
  constructor(Market _market) {
    market = _market;
  }
}
