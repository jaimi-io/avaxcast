import { genKeyPairFromSeed, SkynetClient } from "skynet-js";

const client = new SkynetClient("https://siasky.net");
const { publicKey, privateKey } = genKeyPairFromSeed(
  process.env.REACT_APP_SEED
);

/**
 * Result from the SkyDB
 */
interface SkyDBGetResult {
  data: {
    addresses: string[];
  };
  dataLink: `sia://${string}`;
}

/**
 * Obtains all the contract addresses on SkyDB
 * @returns Promise of all the addresses
 */
export function getContractAddresses(): Promise<string[]> {
  return client.db
    .getJSON(publicKey, process.env.REACT_APP_DATA_KEY)
    .then((res: SkyDBGetResult) => {
      const {
        data: { addresses },
      } = res;
      return addresses;
    })
    .catch((err: Error) => {
      console.error(err);
      return [];
    });
}

/**
 * Inserts the address in the SkyDB
 * @param address - Address of the contract
 */
export async function insertContractAddress(address: string): Promise<void> {
  try {
    const addresses = await getContractAddresses();
    addresses.push(address);
    const dataKey = process.env.REACT_APP_DATA_KEY;
    client.db.setJSON(privateKey, dataKey, {
      addresses: addresses,
    });
  } catch (error) {
    console.error(error);
  }
}
