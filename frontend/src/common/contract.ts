import Market from "common/enums";
import { AbiItem, toBN } from "web3-utils";
import Prediction from "contracts/PredictionMarket.json";
import { Dispatch, SetStateAction } from "react";
import {
  DECIMAL_PLACES,
  FLOAT_TO_SOL_NUM,
  MAX_AVAX_SHARE_PRICE,
  MS_TO_SECS,
  UNDEFINED_PRICE,
} from "./constants";
import { Vote } from "./enums";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import BN from "bn.js";

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
  const { library, account, active } = web3;
  if (!active) {
    return {
      market: Market.AVAX,
      predictedPrice: "string",
      date: "string",
      volume: 0,
      yesPrice: toBN(UNDEFINED_PRICE),
      noPrice: toBN(UNDEFINED_PRICE),
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
  const yesPrice = toBN(
    await contract.methods.yesPrice().call({ from: account })
  );
  const noPrice = MAX_AVAX_SHARE_PRICE.sub(yesPrice);
  const numYesShares = parseInt(
    await contract.methods.numberShares(Vote.Yes).call({ from: account })
  );
  const numNoShares = parseInt(
    await contract.methods.numberShares(Vote.No).call({ from: account })
  );
  const isResolved = await contract.methods
    .isResolved()
    .call({ from: account });
  if (endDate.getDate() > Date.now() && !isResolved) {
    contract.methods.resolveMarket().send({
      from: account,
    });
  }
  const contractInfo = {
    market: parseInt(
      await contract.methods.market().call({ from: account })
    ) as Market,
    predictedPrice: `$${(
      (await contract.methods.predictedPrice().call({ from: account })) /
      FLOAT_TO_SOL_NUM
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
