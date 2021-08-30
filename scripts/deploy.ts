import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { sleep } from "./helpers";
import { Market, Vote } from "../frontend/src/common/markets";

const EXIT_SUCCESSFUL = 0;
const PREDICTED_PRICE = 50;
const MS_TO_SECS = 1000;
const MARKET_DURATION = 10;

const main = async (): Promise<void> => {
  const [owner, addr1] = await ethers.getSigners();
  const PredictionMarket: ContractFactory = await ethers.getContractFactory(
    "contracts/PredictionMarket.sol:PredictionMarket"
  );
  const predictionMarket: Contract = await PredictionMarket.deploy(
    Market.AVAX,
    PREDICTED_PRICE,
    Math.floor(Date.now() / MS_TO_SECS) + MARKET_DURATION
  );

  await predictionMarket.deployed();
  await predictionMarket.buyShares(Vote.Yes, {
    value: ethers.utils.parseEther("0.05"),
  });
  await predictionMarket.connect(addr1).buyShares(Vote.No, {
    value: ethers.utils.parseEther("0.03"),
  });

  console.log(`Prediction Market deployed to: ${predictionMarket.address}`);
  const yesVotes = await predictionMarket.numberShares(Vote.Yes);
  const noVotes = await predictionMarket.numberShares(Vote.No);
  const yesVotesAddr1 = await predictionMarket.sharesPerPerson(
    addr1.address,
    Vote.Yes
  );
  const noVotesAddr1 = await predictionMarket.sharesPerPerson(
    addr1.address,
    Vote.No
  );
  const isResolved = await predictionMarket.isResolved.call();
  const winner = await predictionMarket.winner.call();
  console.log(`Yes votes total ${yesVotes}`);
  console.log(`No votes total ${noVotes}`);
  console.log(`Yes votes addr1 ${yesVotesAddr1}`);
  console.log(`No votes addr1 ${noVotesAddr1}`);
  console.log(`isResolved ${isResolved}`);
  console.log(`Winner ${winner}`);
  console.log(
    `End time ${new Date((await predictionMarket.endTime.call()) * MS_TO_SECS)}`
  );
  console.log(
    `Winning share price ${await predictionMarket.winningPerShare.call()}`
  );
  await sleep(MARKET_DURATION * MS_TO_SECS);
  const resolving = await predictionMarket.resolveMarket();
  console.log(`resolving func ${resolving}`);
  console.log(`isResolved ${await predictionMarket.isResolved.call()}`);
  console.log(
    `Winning share price ${await predictionMarket.winningPerShare.call()}`
  );
  console.log(`Winner ${await predictionMarket.winner.call()}`);
  console.log(`Loser ${await predictionMarket.loser.call()}`);
  console.log(`Num votes y ${await predictionMarket.numberShares(Vote.Yes)}`);
  console.log(`Num votes n ${await predictionMarket.numberShares(Vote.No)}`);
  console.log(
    `Winning share price ${await predictionMarket.winningPerShare.call()}`
  );
  await predictionMarket.withdrawWinnings();
  console.log(
    `Num votes y owner ${await predictionMarket.sharesPerPerson(
      owner.address,
      Vote.Yes
    )}`
  );
};

main()
  .then(() => process.exit(EXIT_SUCCESSFUL))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
