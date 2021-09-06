import Market from "common/enums";
import { AbiItem } from "web3-utils";
import Prediction from "contracts/PredictionMarket.json";
import { Dispatch, SetStateAction } from "react";
import { DECIMAL_PLACES, FLOAT_TO_SOL_NUM, MS_TO_SECS } from "./constants";
import { Vote } from "./enums";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";

export interface ContractI {
  market: Market;
  predictedPrice: string;
  date: string;
  volume: string;
  yesPrice: string;
  noPrice: string;
  address: string;
}

export async function getContractInfo(
  contractAddress: string,
  web3: Web3ReactContextInterface,
  setStateContract?: Dispatch<SetStateAction<ContractI>>
): Promise<ContractI> {
  const { library, account, active } = web3;
  if (!active) {
    return {
      market: Market.AVAX,
      predictedPrice: "string",
      date: "string",
      volume: "string",
      yesPrice: "string",
      noPrice: "string",
      address: contractAddress,
    };
  }
  const contract = new library.eth.Contract(
    Prediction.abi as AbiItem[],
    contractAddress
  );
  const unixTimestamp = await contract.methods
    .endTime()
    .call({ from: account });
  const endDate = new Date(unixTimestamp * MS_TO_SECS);
  const contractInfo = {
    market: await contract.methods.market().call({ from: account }),
    predictedPrice: `$${(
      (await contract.methods.predictedPrice().call({ from: account })) /
      FLOAT_TO_SOL_NUM
    ).toFixed(DECIMAL_PLACES)}`,
    date: endDate.toDateString(),
    volume:
      (await contract.methods.numberShares(Vote.Yes).call({ from: account })) +
      (await contract.methods.numberShares(Vote.No).call({ from: account })),
    // yesPrice: await contract.methods.yesPrice().call({ from: account }),
    yesPrice: "$0.50",
    // noPrice: await contract.methods.noPrice().call({ from: account }),
    noPrice: "$0.50",
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
