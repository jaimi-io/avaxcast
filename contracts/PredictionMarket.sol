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
   * @notice Mapping for the number of shares on both the Yes and No side
   */
  mapping(Vote => uint256) public numberShares;

  /**
   * @notice Mapping for the number of shares an address has for both the Yes and No side
   */
  mapping(address => mapping(Vote => uint256)) public sharesPerPerson;

  /**
   * @notice Current currency prediction market
   */
  Market public market;

  /**
   * @notice Current price for a yes or no share
   */
  uint256 public currentPrice;

  /**
   * @notice Construct a new prediction market
   * @param _market The currency pair for this prediction market
   */
  constructor(Market _market) {
    market = _market;
    currentPrice = 10000000000000000;
  }

  /**
   * @notice Buys shares for user of a given vote
   * @param _vote The vote (yes/no) in the market
   */
  function buyShares(Vote _vote) external payable {
    uint256 numShares = msg.value / currentPrice;
    numberShares[_vote] += numShares;
    sharesPerPerson[msg.sender][_vote] += numShares;
  }
}