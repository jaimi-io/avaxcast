import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { sleep } from "./helpers";

enum Market {
  AvaxUsd = 0,
  BtcUsd,
  EthUsd,
  LinkUsd,
}

enum Vote {
  Yes = 0,
  No,
}

const main = async (): Promise<any> => {
  const [owner, addr1, addr2] = await ethers.getSigners();
  const PredictionMarket: ContractFactory = await ethers.getContractFactory(
    "contracts/PredictionMarket.sol:PredictionMarket"
  );
  const predictionMarket: Contract = await PredictionMarket.deploy(
    Market.AvaxUsd,
    50,
    Math.floor(Date.now() / 1000) + 10
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
    `End time ${new Date((await predictionMarket.endTime.call()) * 1000)}`
  );
  console.log(
    `Winning share price ${await predictionMarket.winningPerShare.call()}`
  );
  await sleep(10000);
  const resolving = await predictionMarket.resolveMarket();
  console.log(`resolving func ${resolving}`);
  console.log(`isResolved ${await predictionMarket.isResolved.call()}`);
  console.log(
    `Winning share price ${await predictionMarket.winningPerShare.call()}`
  );
  console.log(`Winner ${await predictionMarket.winner.call()}`);
  console.log(`Loser ${await predictionMarket.loser.call()}`);
  console.log(`Num votes y ${await predictionMarket.numberShares(0)}`);
  console.log(`Num votes n ${await predictionMarket.numberShares(1)}`);
  console.log(
    `Winning share price ${await predictionMarket.winningPerShare.call()}`
  );
  await predictionMarket.withdrawWinnings();
  console.log(
    `Num votes y owner ${await predictionMarket.sharesPerPerson(
      owner.address,
      0
    )}`
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
