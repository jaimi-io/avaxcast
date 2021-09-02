import { Dispatch, SetStateAction } from "react";
import { genKeyPairFromSeed, SkynetClient } from "skynet-js";

const client = new SkynetClient("https://siasky.net");
const { publicKey, privateKey } = genKeyPairFromSeed(
  process.env.REACT_APP_SEED
);

interface Data {
  addresses: string[];
}

interface SkyDBGetResult {
  data: Data;
  dataLink: `sia://${string}`;
}

export async function getContractAddresses(
  setFunc?: Dispatch<SetStateAction<string[]>>
): Promise<string[]> {
  await client.db
    .getJSON(publicKey, process.env.REACT_APP_DATA_KEY)
    .then((res: SkyDBGetResult) => {
      const {
        data: { addresses },
      } = res;
      if (setFunc) {
        setFunc(addresses);
      }
      return addresses;
    })
    .catch(console.error);
  return [];
}

export async function insertContractAddress(address: string): Promise<void> {
  try {
    const addresses = await getContractAddresses();
    addresses.push(address);
    const dataKey = process.env.REACT_APP_DATA_KEY;
    await client.db.setJSON(privateKey, dataKey, {
      addresses: addresses,
    });
    console.log(addresses, "updated address array");
  } catch (error) {
    console.error(error);
  }
}
