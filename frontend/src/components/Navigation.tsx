import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Markets from "components/Markets";
import Portfolio from "components/Portfolio";

export default function Navigation(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Markets} />
        <Route exact path="/portfolio" component={Portfolio}></Route>
      </Switch>
    </Router>
  );
}
