import Market from "common/enums";
import { AbiItem, toBN } from "web3-utils";
import Prediction from "contracts/PredictionMarket.json";
import { Dispatch, SetStateAction } from "react";
import {
  DECIMAL_PLACES,
  FLOAT_TO_SOL_NUM,
  MAX_AVAX_SHARE_PRICE,
  MS_TO_SECS,
} from "./constants";
import { Vote } from "./enums";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import BN from "bn.js";
import Web3 from "web3";

export interface ContractI {
  market: Market;
  predictedPrice: string;
  date: string;
  volume: number;
  yesPrice: BN;
  noPrice: BN;
  address: string;
}

interface MarketInfo {
  numberNoShares: string;
  numberYesShares: string;
  market: string;
  predictedPrice: number;
  endTime: number;
  yesPrice: string;
  isResolved: boolean;
}

export async function getContractInfo(
  contractAddress: string,
  setStateContract?: Dispatch<SetStateAction<ContractI>>
): Promise<ContractI> {
  const library = new Web3(
    new Web3.providers.HttpProvider(
      "https://api.avax-test.network/ext/bc/C/rpc"
    )
  );

  const contract = new library.eth.Contract(
    Prediction.abi as AbiItem[],
    contractAddress
  );

  // const isResolved = await contract.methods
  //   .isResolved()
  //   .call();

  // if (endDate.getDate() > Date.now() && !isResolved) {
  //   contract.methods.resolveMarket().send({
  //     from: account,
  //   });
  // }

  const marketInfo: MarketInfo = await contract.methods.marketInfo().call();
  const endDate = new Date(marketInfo.endTime * MS_TO_SECS);
  const yesPrice = toBN(marketInfo.yesPrice);
  const noPrice = MAX_AVAX_SHARE_PRICE.sub(yesPrice);
  const volume =
    parseInt(marketInfo.numberYesShares) + parseInt(marketInfo.numberNoShares);

  const contractInfo = {
    market: parseInt(marketInfo.market) as Market,
    predictedPrice: `$${(marketInfo.predictedPrice / FLOAT_TO_SOL_NUM).toFixed(
      DECIMAL_PLACES
    )}`,
    date: endDate.toDateString(),
    volume: volume,
    yesPrice: yesPrice,
    noPrice: noPrice,
    address: contractAddress,
  };

  if (setStateContract) {
    setStateContract(contractInfo);
  }

  return contractInfo;
}

export async function getAllContractInfo(
  contractAddresses: string[]
): Promise<ContractI[]> {
  const allContractInfo = await Promise.all(
    contractAddresses.map((addr) => getContractInfo(addr))
  );
  return allContractInfo;
}

export async function buy(
  contractAddress: string,
  web3: Web3ReactContextInterface,
  vote: Vote,
  price: BN
): Promise<void> {
  const { library, account } = web3;
  const contract = new library.eth.Contract(
    Prediction.abi as AbiItem[],
    contractAddress
  );
  await contract.methods.buyShares(vote).send({
    from: account,
    value: price,
  });
}

export interface VotesPerPerson {
  yesVotes: number;
  noVotes: number;
}

export async function getCurrentVotes(
  contractAddress: string,
  web3: Web3ReactContextInterface
): Promise<VotesPerPerson> {
  const { library, account } = web3;
  const contract = new library.eth.Contract(
    Prediction.abi as AbiItem[],
    contractAddress
  );
  let yesVotes = parseInt(
    await contract.methods.sharesPerPerson(account, Vote.Yes).call()
  );
  let noVotes = parseInt(
    await contract.methods.sharesPerPerson(account, Vote.No).call()
  );
  if (isNaN(yesVotes)) {
    yesVotes = 0;
  }
  if (isNaN(noVotes)) {
    noVotes = 0;
  }
  return {
    yesVotes: yesVotes,
    noVotes: noVotes,
  };
}
