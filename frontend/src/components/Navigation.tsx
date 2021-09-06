import Market from "./Market";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useParams,
} from "react-router-dom";
import AddMarket from "./AddMarket";
import Markets from "./MarketPlace";
import Navbar from "./Navbar";
import Portfolio from "./Portfolio";

interface PropsT {
  address: string;
}

const MarketFunc = () => {
  return <Market address={useParams<PropsT>().address} />;
};

export default function Navigation(): JSX.Element {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Markets} />
        <Route exact path="/portfolio" component={Portfolio}></Route>
        <Route exact path="/addmarket" component={AddMarket}></Route>
        <Route exact path="/market/:address" component={MarketFunc}></Route>
      </Switch>
    </Router>
  );
}
