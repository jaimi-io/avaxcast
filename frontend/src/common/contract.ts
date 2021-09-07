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

export async function getContractInfo(
  contractAddress: string,
  web3: Web3ReactContextInterface,
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
  const unixTimestamp = await contract.methods.endTime().call();
  const endDate = new Date(unixTimestamp * MS_TO_SECS);
  const yesPrice = toBN(await contract.methods.yesPrice().call());
  const noPrice = MAX_AVAX_SHARE_PRICE.sub(yesPrice);
  const numYesShares = parseInt(
    await contract.methods.numberShares(Vote.Yes).call()
  );
  const numNoShares = parseInt(
    await contract.methods.numberShares(Vote.No).call()
  );
  // const isResolved = await contract.methods
  //   .isResolved()
  //   .call();

  // if (endDate.getDate() > Date.now() && !isResolved) {
  //   contract.methods.resolveMarket().send({
  //     from: account,
  //   });
  // }

  const contractInfo = {
    market: parseInt(await contract.methods.market().call()) as Market,
    predictedPrice: `$${(
      (await contract.methods.predictedPrice().call()) / FLOAT_TO_SOL_NUM
    ).toFixed(DECIMAL_PLACES)}`,
    date: endDate.toDateString(),
    volume: numYesShares + numNoShares,
    yesPrice: yesPrice,
    noPrice: noPrice,
    address: contractAddress,
  };

  console.log(contractInfo);
  if (setStateContract) {
    setStateContract(contractInfo);
  }

  return contractInfo;
}

export async function getAllContractInfo(
  contractAddresses: string[],
  web3: Web3ReactContextInterface,
  setStateContract: Dispatch<SetStateAction<ContractI[]>>
): Promise<ContractI[]> {
  const allContractInfo = await Promise.all(
    contractAddresses.map((addr) => getContractInfo(addr, web3))
  );
  setStateContract(allContractInfo);
  return allContractInfo;
}

export async function buy(
  contractAddress: string,
  web3: Web3ReactContextInterface,
  vote: Vote,
  price: BN
): Promise<void> {
  const { library, account, active } = web3;
  if (!active) {
    return;
  }
  const contract = new library.eth.Contract(
    Prediction.abi as AbiItem[],
    contractAddress
  );
  await contract.methods.buyShares(vote).send({
    from: account,
    value: price,
  });
}
