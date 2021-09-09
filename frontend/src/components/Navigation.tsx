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
import { ContractI, getAllContractInfo } from "common/contract";

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

  const fetchContracts = async () => {
    const addresses = await getContractAddresses();
    setValidAddresses(addresses);
    const contracts = await getAllContractInfo(addresses);
    setContracts(contracts);
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <Router>
      <Suspense fallback={<LinearProgress />}>
        <Navbar />
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
          <Route
            exact
            path="/portfolio"
            render={() => <Portfolio addresses={validAddresses} />}
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
