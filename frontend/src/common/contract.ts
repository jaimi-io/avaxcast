import { Market } from "common/enums";
import { AbiItem, toBN } from "web3-utils";
import Prediction from "contracts/PredictionMarket.json";
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

/**
 * Calls the resolveMarket() function from the contract
 * @param contract - Contract instance for PredictionMarket
 * @param library - Web3 library instance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolveMarket(contract: any, library: Web3) {
  let gas: number;
  try {
    gas = await contract.methods.resolveMarket().estimateGas();
  } catch (error) {
    console.log(error);
    return;
  }
  const tx = {
    from: process.env.REACT_APP_PUBLIC_KEY,
    to: contract.options.address,
    data: contract.methods.resolveMarket().encodeABI(),
    gas: gas,
  };

  const signPromise = library.eth.accounts.signTransaction(
    tx,
    process.env.REACT_APP_PRIVATE_KEY || ""
  );

  signPromise
    .then((signedTx) => {
      if (!signedTx.rawTransaction) {
        return;
      }
      const sentTx = library.eth.sendSignedTransaction(signedTx.rawTransaction);
      sentTx.on("receipt", (receipt) => {
        console.log(receipt);
      });
      sentTx.on("error", (err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

/**
 * Information regarding a contract
 */
export interface ContractI {
  /**
   * {@link Market}
   */
  market: Market;
  predictedPrice: string;
  date: Date;
  volume: BN;
  yesPrice: BN;
  noPrice: BN;
  address: string;
  isResolved: boolean;
  winner?: Vote;
  winningPerShare?: BN;
}

/**
 * Information regarding each {@link Market}
 */
interface MarketInfo {
  numberNoShares: string;
  numberYesShares: string;
  market: string;
  predictedPrice: number;
  endTime: number;
  yesPrice: string;
  isResolved: boolean;
}

/**
 * Obtains information on the contract with address `contractAddress`
 * @param contractAddress - Address of contract
 * @returns Promise of information on the contract
 */
export async function getContractInfo(
  contractAddress: string
): Promise<ContractI> {
  const library = new Web3(
    process.env.REACT_APP_RPC_URL ||
      "https://api.avax-test.network/ext/bc/C/rpc"
  );

  const contract = new library.eth.Contract(
    Prediction.abi as AbiItem[],
    contractAddress
  );

  let marketInfo: MarketInfo = await contract.methods.marketInfo().call();
  let endDate = new Date(marketInfo.endTime * MS_TO_SECS);
  if (endDate < new Date(Date.now()) && !marketInfo.isResolved) {
    await resolveMarket(contract, library);
    marketInfo = await contract.methods.marketInfo().call();
    endDate = new Date(marketInfo.endTime * MS_TO_SECS);
  }

  const yesPrice = toBN(marketInfo.yesPrice);
  const noPrice = MAX_AVAX_SHARE_PRICE.sub(yesPrice);
  const volume = await library.eth.getBalance(contractAddress);

  const contractInfo: ContractI = {
    market: parseInt(marketInfo.market) as Market,
    predictedPrice: `$${(marketInfo.predictedPrice / FLOAT_TO_SOL_NUM).toFixed(
      DECIMAL_PLACES
    )}`,
    date: endDate,
    volume: toBN(volume),
    yesPrice: yesPrice,
    noPrice: noPrice,
    address: contractAddress,
    isResolved: marketInfo.isResolved,
  };

  if (marketInfo.isResolved) {
    contractInfo.winner = parseInt(
      await contract.methods.winner().call()
    ) as Vote;
    contractInfo.winningPerShare = toBN(
      await contract.methods.winningPerShare().call()
    );
  }

  return contractInfo;
}

/**
 * Obtains information on all contracts with an address in `contractAddress`
 * @param contractAddresses - Addresses of all the contracts
 * @returns Promise of all contract information
 */
export async function getAllContractInfo(
  contractAddresses: string[]
): Promise<ContractI[]> {
  const allContractInfo = await Promise.all(
    contractAddresses.map((addr) => getContractInfo(addr))
  );
  return allContractInfo;
}

/**
 * Purchase shares
 * @param contractAddress - Address of the contract
 * @param web3 - Web3 instance
 * @param vote - Yes or No
 * @param price - Total price of shares to buy
 */
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

/**
 * Withdraw winning shares
 * @param contractAddress - Address of the contract
 * @param web3 - Web3 instance
 */
export async function withdraw(
  contractAddress: string,
  web3: Web3ReactContextInterface
): Promise<void> {
  const { library, account } = web3;
  const contract = new library.eth.Contract(
    Prediction.abi as AbiItem[],
    contractAddress
  );
  await contract.methods.withdrawWinnings().send({
    from: account,
  });
}

/**
 * Number of {@link Vote}s per person
 */
export interface VotesPerPerson {
  yesVotes: number;
  noVotes: number;
}

/**
 * Obtains number of votes for Yes and No
 * @param contractAddress - Address of the contract
 * @param web3 - Web3 instance
 * @returns Number of Yes and No votes
 */
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

/**
 * Information for each Transaction the user has made with a Market
 */
interface TransactionRecord {
  date: string;
  transactionHash: string;
  vote: string;
  price: BN;
}

/**
 * Information for any Market the user has invested in
 */
export interface MarketRecord {
  address: string;
  market: Market;
  yesVotes: number;
  noVotes: number;
  totalMoney: BN;
  deadline: string;
  history: TransactionRecord[];
  status: string;
}

/**
 * Information returned by the emitted `Buy` event
 */
interface BuyReturnValues {
  _numberShares: string;
  _vote: string;
  _totalPrice: string;
}

/**
 * Information for any Event on the Contract
 */
interface ContractEvent {
  transactionHash: string;
  address: string;
  returnValues: BuyReturnValues;
  blockNumber: number;
}

/**
 * Converts an event to a transcation record
 * @param event - The event to convert
 * @returns The transcation record
 */
function convertToTransRecord(event: ContractEvent): TransactionRecord {
  return {
    date: `${event.blockNumber}`,
    transactionHash: event.transactionHash,
    vote: voteString[parseInt(event.returnValues._vote)],
    price: toBN(event.returnValues._totalPrice),
  };
}

/**
 * Retrieves information for one market
 * @param filteredEvents - Events the user has invested in
 * @param web3 - Web3 instance
 * @returns Promise of information for the market
 */
async function retrieveHoldingInfo(
  filteredEvents: ContractEvent[],
  web3: Web3ReactContextInterface
): Promise<MarketRecord> {
  const contractAddress = filteredEvents[0].address;
  const { isResolved, winner, market, date } = await getContractInfo(
    contractAddress
  );
  const { yesVotes, noVotes } = await getCurrentVotes(contractAddress, web3);
  let totalMoney = toBN(0);
  const history = filteredEvents.map((event) => {
    const record = convertToTransRecord(event);
    totalMoney = totalMoney.add(record.price);
    return record;
  });
  let status = "Open";
  if (isResolved) {
    status = "Resolved";
    if (winner === Vote.Yes && yesVotes === 0) {
      status = "Withdrawn";
    }
    if (winner === Vote.No && noVotes === 0) {
      status = "Withdrawn";
    }
  }
  const holdingInfo: MarketRecord = {
    address: contractAddress,
    market: market,
    yesVotes: yesVotes,
    noVotes: noVotes,
    totalMoney: totalMoney,
    deadline: date.toDateString(),
    history: history,
    status: status,
  };
  return holdingInfo;
}

/**
 * Retrieves information for the markets
 * @param contractAddresses - The contract address
 * @param web3 - Web3 instance
 * @returns Promise of all information for many markets
 */
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
        filter: { _from: account },
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
