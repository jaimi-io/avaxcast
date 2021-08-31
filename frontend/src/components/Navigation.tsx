import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AddMarket from "./AddMarket";
import Markets from "./MarketPlace";
import Navbar from "./Navbar";
import Portfolio from "./Portfolio";

export default function Navigation(): JSX.Element {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Markets} />
        <Route exact path="/portfolio" component={Portfolio}></Route>
        <Route exact path="/addmarket" component={AddMarket}></Route>
      </Switch>
    </Router>
  );
}
