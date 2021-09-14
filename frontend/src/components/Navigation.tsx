import Market from "./Market";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import { LinearProgress } from "@material-ui/core";
import { getContractAddresses } from "common/skyDb";
import {
  ContractI,
  getAllContractInfo,
  getHoldings,
  MarketRecord,
} from "common/contract";
import { useWeb3React } from "@web3-react/core";
import { useAppDispatch } from "hooks";
import { isLoading, notLoading } from "actions";
import Home from "./Home";

const AddMarket = lazy(() => import("./AddMarket"));
const MarketPlace = lazy(() => import("./MarketPlace"));
const Navbar = lazy(() => import("./Navbar"));
const Portfolio = lazy(() => import("./Portfolio"));
const NotFound = lazy(() => import("./NotFound"));

interface PropsT {
  address: string;
}

/**
 * Gives each Market a unique Route
 * @param validAddresses - List of valid addresses in the SkyDB
 * @returns Market Component for the address or redirects to 404 if invalid
 */
const marketFunc = (validAddresses: string[]): JSX.Element => {
  const { address } = useParams<PropsT>();
  if (validAddresses.includes(address)) {
    return <Market address={address} />;
  }
  return <Redirect to="/404" />;
};

/**
 * Routes used for the DApp
 * @returns The Navigation Component
 */
function Navigation(): JSX.Element {
  const [validAddresses, setValidAddresses] = useState<string[]>([]);
  const [contracts, setContracts] = useState<ContractI[]>([]);
  const [marketRecords, setMarketRecords] = useState<MarketRecord[]>([]);
  const web3 = useWeb3React();
  const dispatch = useAppDispatch();

  const fetchHoldings = async () => {
    if (!web3.active) {
      if (marketRecords.length !== 0) {
        setMarketRecords([]);
      }
      return;
    }
    dispatch(isLoading());
    const records = await getHoldings(validAddresses, web3);
    setMarketRecords(records);
    dispatch(notLoading());
  };

  const fetchContracts = async () => {
    dispatch(isLoading());
    const addresses = await getContractAddresses();
    setValidAddresses(addresses);
    const contracts = await getAllContractInfo(addresses);
    setContracts(contracts);
    dispatch(notLoading());
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <Router>
      <Suspense fallback={<LinearProgress />}>
        <Navbar fetchHoldings={fetchHoldings} />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <MarketPlace
                contracts={contracts}
                fetchContracts={fetchContracts}
              />
            )}
          />
          <Route exact path="/home" component={Home} />
          <Route
            exact
            path="/portfolio"
            render={() => (
              <Portfolio
                records={marketRecords}
                fetchHoldings={fetchHoldings}
              />
            )}
          />
          <Route exact path="/addmarket" component={AddMarket} />
          <Route
            exact
            path="/market/:address"
            component={() => marketFunc(validAddresses)}
          />
          <Route exact path="/404" component={NotFound} />
          <Redirect to="/404" />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default Navigation;
