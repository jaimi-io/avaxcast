import { genKeyPairFromSeed, SkynetClient } from "skynet-js";

const client = new SkynetClient("https://siasky.net");
const { publicKey, privateKey } = genKeyPairFromSeed(
  process.env.REACT_APP_SEED
);

interface Data {
  addresses: string[];
}

export async function getContractAddresses(): Promise<string[]> {
  const { data } = await client.db.getJSON(
    publicKey,
    process.env.REACT_APP_DATA_KEY
  );
  const { addresses }: Data = data;
  return addresses;
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
    console.log(error);
  }
}
