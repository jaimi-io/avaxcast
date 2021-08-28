import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

/**
 *  active: is a wallet actively connected right now?
    account: the blockchain address that is connected
    library: this is either web3 or ethers, depending what you passed in
    connector: the current connector. So, when we connect it will be the injected connector in this example
    activate: the method to connect to a wallet
    deactivate: the method to disconnect from a wallet
 */

const avaxLocalId = 43112;
const avaxFujiId = 43113;

const injected = new InjectedConnector({
  supportedChainIds: [avaxLocalId, avaxFujiId],
});

function Wallet(): JSX.Element {
  const { active, account, activate, deactivate } = useWeb3React();

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <div>
      <button onClick={connect}>Connect to MetaMask</button>
      {active ? (
        <span>
          Connected with <b>{account}</b>
        </span>
      ) : (
        <span>Not connected</span>
      )}
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}

export default Wallet;
