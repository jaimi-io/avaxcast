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
import { voteString } from "./markets";

export interface ContractI {
  market: Market;
  predictedPrice: string;
  date: Date;
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

  // if (endDate.getCurrentDateString() > Date.now() && !isResolved) {
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
    date: endDate,
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

interface TransactionRecord {
  date: string;
  transactionHash: string;
  vote: string;
  price: BN;
}

export interface MarketRecord {
  address: string;
  market: Market;
  yesVotes: number;
  noVotes: number;
  totalMoney: BN;
  deadline: string;
  history: TransactionRecord[];
}

interface BuyReturnValues {
  _numberShares: string;
  _vote: string;
  _totalPrice: string;
}

interface ContractEvent {
  transactionHash: string;
  address: string;
  returnValues: BuyReturnValues;
  blockNumber: number;
}

function convertToTransRecord(event: ContractEvent) {
  return {
    date: `${event.blockNumber}`,
    transactionHash: event.transactionHash,
    vote: voteString[parseInt(event.returnValues._vote)],
    price: toBN(event.returnValues._totalPrice),
  };
}

async function retrieveHoldingInfo(
  filteredEvents: ContractEvent[],
  web3: Web3ReactContextInterface
): Promise<MarketRecord> {
  const contractAddress = filteredEvents[0].address;
  const contractInfo = await getContractInfo(contractAddress);
  const voteInfo = await getCurrentVotes(contractAddress, web3);
  let totalMoney = toBN(0);
  const history = filteredEvents.map((event) => {
    const record = convertToTransRecord(event);
    totalMoney = totalMoney.add(record.price);
    return record;
  });
  const holdingInfo = {
    address: contractAddress,
    market: contractInfo.market,
    yesVotes: voteInfo.yesVotes,
    noVotes: voteInfo.noVotes,
    totalMoney: totalMoney,
    deadline: contractInfo.date.toDateString(),
    history: history,
  };
  return holdingInfo;
}

export async function getHoldings(
  contractAddresses: string[],
  web3: Web3ReactContextInterface
): Promise<MarketRecord[]> {
  const { library, account } = web3;
  const contractEvents = await Promise.all(
    contractAddresses.map(async (addr) => {
      const contract = new library.eth.Contract(
        Prediction.abi as AbiItem[],
        addr
      );
      const events: ContractEvent[] = await contract.getPastEvents("Buy", {
        filter: { address: account },
        fromBlock: 0,
        toBlock: "latest",
      });
      return events;
    })
  );
  const filteredEvents = contractEvents.filter((events) => events.length !== 0);
  const holdingInfos = await Promise.all(
    filteredEvents.map((events) => retrieveHoldingInfo(events, web3))
  );
  return holdingInfos;
}
