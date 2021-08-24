// SPDX-License-Identifier: MIT
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
   * @notice Enum of vote options
   */
  enum Vote {
    Yes,
    No
  }

  /**
   * @notice Mapping for the number of votes on both the Yes and No side
   */
  mapping(Vote => uint256) public numberVotes;

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
