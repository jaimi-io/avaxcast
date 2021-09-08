import Market from "./Market";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import { lazy, Suspense } from "react";
// import Fallback from "./Fallback";

const AddMarket = lazy(() => import("./AddMarket"));
const MarketPlace = lazy(() => import("./MarketPlace"));
const Navbar = lazy(() => import("./Navbar"));
const Portfolio = lazy(() => import("./Portfolio"));
const NotFound = lazy(() => import("./NotFound"));

interface PropsT {
  address: string;
}

const MarketFunc = () => {
  return <Market address={useParams<PropsT>().address} />;
};

export default function Navigation(): JSX.Element {
  return (
    <Router>
      <Suspense fallback={<div> Loading... </div>}>
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
