import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Markets from "components/Markets";
import Portfolio from "components/Portfolio";
import Navbar from "./Navbar";

export default function Navigation(): JSX.Element {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Markets} />
        <Route exact path="/portfolio" component={Portfolio}></Route>
      </Switch>
    </Router>
  );
}
