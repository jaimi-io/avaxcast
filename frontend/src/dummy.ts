import { Market } from "common/markets";

export interface PostsT {
  market: Market;
  predictedPrice: string;
  date: string;
  volume: string;
  yesPrice: string;
  noPrice: string;
  address: string;
}

export const posts: PostsT[] = [
  {
    market: Market.AVAX,
    predictedPrice: "$10.00",
    date: "2021-20-10",
    volume: "$2,000",
    yesPrice: "$0.50",
    noPrice: "$0.50",
    address: "0xA7184E32858b3B3F3C5D33ef21cadFFDb7db0752",
  },

  {
    market: Market.ETH,
    predictedPrice: "$20.00",
    date: "2021-21-9",
    volume: "$3,000",
    yesPrice: "$0.25",
    noPrice: "$0.75",
    address: "0x572f4D80f10f663B5049F789546f25f70Bb62a7F",
  },
];
