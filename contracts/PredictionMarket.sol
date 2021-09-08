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
   * @notice Event for buying shares in a prediction
   */
  event Buy(
    address indexed _from,
    uint256 _numberShares,
    Vote _vote,
    uint256 _totalPrice
  );

  /**
   * @notice Event for withdrawing shares in a winning prediction
   */
  event Withdraw(
    address indexed _to,
    uint256 _numberShares,
    Vote _vote,
    uint256 _totalPrice
  );

  /**
   * @notice Struct containing all important market info for FE retrieval
   */
  struct MarketInfo {
    /**
     * @notice Number of `Yes` shares currently bought
     */
    uint256 numberYesShares;
    /**
     * @notice Number of `No` shares currently bought
     */
    uint256 numberNoShares;
    /**
     * @notice Current currency prediction market
     */
    Market market;
    /**
     * @notice Predicted price goal for the currency pair
     */
    int256 predictedPrice;
    /**
     * @notice End time for the prediction market to be resolved at
     */
    uint256 endTime;
    /**
     * @notice Current price for a yes share
     */
    uint256 yesPrice;
    /**
     * @notice Bool for whether the prediction market has been resolved or not
     */
    bool isResolved;
  }

  /**
   * @notice Mapping for the number of shares an address has for both the Yes and No side
   */
  mapping(address => mapping(Vote => uint256)) public sharesPerPerson;

  /**
   * @notice Which vote (yes/no) has won/ the prediction market (once resolved)
   */
  Vote public winner;

  /**
   * @notice The winnings per share in AVAX, calculated once market is resolved
   */
  uint256 public winningPerShare;

  /**
   * @dev Chainlink price feed for the given currency pair
   */
  AggregatorV3Interface private priceFeed;

  /**
   * @dev Struct to contain important market information
   */
  MarketInfo public marketInfo;

  /**
   * @notice Construct a new prediction market
   * @param _market The currency pair for this prediction market i.e. AVAX/USD
   * @param _predictedPrice Predicted price goal for the currency pair
   * @param _endTime End time for the prediction market to be resolved at
   */
  constructor(
    Market _market,
    int256 _predictedPrice,
    uint256 _endTime
  ) {
    marketInfo.market = _market;
    marketInfo.predictedPrice = _predictedPrice;
    marketInfo.endTime = _endTime;
    _setPriceFeed(_market);
    marketInfo.yesPrice = 0.01 ether;
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
   * @dev Update yesPrice after shares have been bought, for under 1000 votes use
   * an increasing spread with the percent.
   */
  function updatePrice() private {
    uint256 totalVotes = marketInfo.numberNoShares + marketInfo.numberYesShares;
    uint256 precision = 100;
    uint256 yesPercent = (marketInfo.numberYesShares * precision) / totalVotes;
    if (yesPercent == 0) {
      yesPercent = 1;
    }
    if (totalVotes >= 1000) {
      if (yesPercent == 100) {
        yesPercent = 99;
      }
      marketInfo.yesPrice = (yesPercent * 0.02 ether) / precision;
      return;
    }
    uint256 spread = totalVotes / 10;
    if (spread == 0) {
      spread = 1;
    }
    uint256 mid = (spread * precision) / 2;
    uint256 spreadPercent = yesPercent * spread;
    uint256 midPercent = 50 * precision;
    if (spreadPercent > mid) {
      yesPercent = midPercent + (spreadPercent - mid);
    } else {
      yesPercent = midPercent - (mid - spreadPercent);
    }
    marketInfo.yesPrice = (yesPercent * 0.02 ether) / (precision * precision);
  }

  /**
   * @notice Buys shares in the market for user of a given vote
   * @dev Only executed if called before market end time
   * @param _vote The vote (yes/no) in the market
   */
  function buyShares(Vote _vote) external payable {
    require(
      !marketInfo.isResolved && block.timestamp <= marketInfo.endTime,
      "Cannot buy shares after market endTime"
    );
    uint256 pricePerShare = _vote == Vote.Yes
      ? marketInfo.yesPrice
      : 0.02 ether - marketInfo.yesPrice;
    uint256 numShares = msg.value / pricePerShare;
    if (_vote == Vote.Yes) {
      marketInfo.numberYesShares += numShares;
    } else {
      marketInfo.numberNoShares += numShares;
    }
    sharesPerPerson[msg.sender][_vote] += numShares;
    emit Buy(msg.sender, numShares, _vote, msg.value);
    updatePrice();
  }

  /**
   * @notice Uses Chainlink price feed to get price at market end time
   to resolve the market & declare the winning vote
   */
  function resolveMarket() external {
    require(!marketInfo.isResolved, "Market has already been resolved");
    require(
      block.timestamp > marketInfo.endTime,
      "Cannot resolve market before endTime"
    );
    uint80 roundID;
    int256 price;
    uint256 timeStamp;
    (roundID, price, , timeStamp, ) = priceFeed.latestRoundData();
    while (timeStamp > marketInfo.endTime) {
      roundID--;
      (roundID, price, , timeStamp, ) = priceFeed.getRoundData(roundID);
    }
    uint256 numWinningShares;
    if (price >= marketInfo.predictedPrice) {
      winner = Vote.Yes;
      numWinningShares = marketInfo.numberYesShares;
    } else {
      winner = Vote.No;
      numWinningShares = marketInfo.numberNoShares;
    }
    marketInfo.isResolved = true;
    if (numWinningShares == 0) {
      numWinningShares = 1;
    }
    winningPerShare = address(this).balance / numWinningShares;
  }

  /**
   * @notice Withdraw winning shares, only active once market is resolved
   */
  function withdrawWinnings() external {
    require(marketInfo.isResolved, "Market has not been resolved yet");
    uint256 winningShares = sharesPerPerson[msg.sender][winner];
    require(winningShares > 0, "You have no winning shares");
    sharesPerPerson[msg.sender][winner] = 0;
    uint256 winningAmount = winningShares * winningPerShare;
    payable(msg.sender).transfer(winningAmount);
    emit Withdraw(msg.sender, winningShares, winner, winningAmount);
  }
}
