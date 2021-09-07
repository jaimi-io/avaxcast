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
