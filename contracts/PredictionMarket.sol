// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

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
   * @dev Predicted price goal for the currency pair
   */
  int256 private predictedPrice;

  /**
   * @notice End time for the prediction market to be resolved at
   */
  uint256 public endTime;

  /**
   * @notice Current price for a yes or no share
   */
  uint256 public currentPrice;

  /**
   * @dev Bool for whether the prediction market has been resolved or not
   */
  bool private isResolved = false;

  /**
   * @dev Which vote (yes/no) has won the prediction market (once resolved)
   */
  Vote private winner;

  /**
   * @dev Chainlink price feed for the given currency pair
   */
  AggregatorV3Interface private priceFeed;

  /**
   * @notice Construct a new prediction market
   * @param _market The currency pair for this prediction market i.e. AVAX/USD
   * @param _predictedPrice Predicted price goal for the currency pair
   * @param _endTime TEnd time for the prediction market to be resolved at
   */
  constructor(
    Market _market,
    int256 _predictedPrice,
    uint256 _endTime
  ) {
    market = _market;
    predictedPrice = _predictedPrice;
    endTime = _endTime;
    _setPriceFeed(_market);
    currentPrice = 10000000000000000;
  }

  /**
   * @dev Sets the Chainlink price feed for the given currency pair
   * @param _market The currency pair for this prediction market i.e. AVAX/USD
   */
  function _setPriceFeed(Market _market) private {
    address[4] memory chainlinkOracles = [
      0x5498BB86BC934c8D34FDA08E81D444153d0D06aD,
      0x31CF013A08c6Ac228C94551d535d5BAfE19c602a,
      0x86d67c3D38D2bCeE722E601025C25a575021c6EA,
      0x34C4c526902d88a3Aa98DB8a9b802603EB1E3470
    ];
    priceFeed = AggregatorV3Interface(chainlinkOracles[uint256(_market)]);
  }

  /**
   * @notice Buys shares in the market for user of a given vote
   * @dev Only executed if called before market end time
   * @param _vote The vote (yes/no) in the market
   */
  function buyShares(Vote _vote) external payable {
    require(
      !isResolved && block.timestamp <= endTime,
      "Cannot buy shares after market endTime"
    );
    uint256 numShares = msg.value / currentPrice;
    numberShares[_vote] += numShares;
    sharesPerPerson[msg.sender][_vote] += numShares;
  }

  function _resolveMarket() private {
    uint80 roundID;
    int256 price;
    uint256 timeStamp;
    (roundID, price, , timeStamp, ) = priceFeed.latestRoundData();
    while (timeStamp > endTime) {
      roundID--;
      (roundID, price, , timeStamp, ) = priceFeed.getRoundData(roundID);
      if (timeStamp <= endTime) {
        break;
      }
    }
    if (predictedPrice >= price) {
      winner = Vote.Yes;
    } else {
      winner = Vote.No;
    }
    isResolved = true;
  }
}
