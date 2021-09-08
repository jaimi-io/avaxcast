## `PredictionMarket`

### `constructor(enum PredictionMarket.Market _market, int256 _predictedPrice, uint256 _endTime)` (public)

Construct a new prediction market

### `buyShares(enum PredictionMarket.Vote _vote)` (external)

Buys shares in the market for user of a given vote

Only executed if called before market end time

### `resolveMarket()` (external)

Uses Chainlink price feed to get price at market end time
to resolve the market & declare the winning vote

### `withdrawWinnings()` (external)

Withdraw winning shares, only active once market is resolved

### `Buy(address _from, uint256 _numberShares, enum PredictionMarket.Vote _vote, uint256 _totalPrice)`

Event for buying shares in a prediction

### `Withdraw(address _to, uint256 _numberShares, enum PredictionMarket.Vote _vote, uint256 _totalPrice)`

Event for withdrawing shares in a winning prediction
