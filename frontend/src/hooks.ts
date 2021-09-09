import { ContractI, getContractInfo } from "common/contract";
import { Market, Vote } from "common/enums";
import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "store";
import { toBN } from "web3-utils";

// Use throughout app instead of plain `useDispatch` and `useSelector`

/**
 * Custom useSelector hook with type safety
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
/**
 * Custom useDispatch hook with type safety
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

/**
 * Cache used to store previous information for contracts
 */
interface CacheI {
  [key: string]: ContractI;
}

const cache: CacheI = {};
const dummy: ContractI = {
  market: Market.ALL,
  predictedPrice: "$X",
  date: new Date(),
  volume: toBN(0),
  yesPrice: toBN(0),
  noPrice: toBN(0),
  address: "0xfe6...",
  isResolved: false,
  winner: Vote.Yes,
  winningPerShare: toBN(0),
};

/**
 * Used to fetch information on the contract and store it
 * @param address - The address of the contract
 * @returns Information on the {@link ContractI}
 */
export const useFetchContract = (address: string): ContractI => {
  const [data, setData] = useState<ContractI>(dummy);

  useEffect(() => {
    if (!address) {
      return;
    }

    const fetchData = async () => {
      if (cache[address]) {
        setData(cache[address]);
      }
      const data = await getContractInfo(address);
      cache[address] = data;
      setData(cache[address]);
    };

    fetchData();
  }, [address]);

  return data;
};
