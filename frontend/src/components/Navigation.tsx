import Market from "./Market";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { LinearProgress } from "@material-ui/core";

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
 * @returns Market Component for the address
 */
const MarketFunc = () => {
  return <Market address={useParams<PropsT>().address} />;
};

/**
 * Routes used for the DApp
 * @returns The Navigation Component
 */
function Navigation(): JSX.Element {
  return (
    <Router>
      <Suspense fallback={<LinearProgress />}>
        <Navbar />
        <Switch>
          <Route exact path="/" component={MarketPlace} />
          <Route exact path="/portfolio" component={Portfolio} />
          <Route exact path="/addmarket" component={AddMarket} />
          <Route exact path="/market/:address" component={MarketFunc} />
          <Route exact path="/404" component={NotFound} />
          <Redirect to="/404" />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default Navigation;
