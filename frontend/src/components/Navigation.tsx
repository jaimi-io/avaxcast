import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Markets from "./Markets";

export default function Navigation(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Markets}></Route>
      </Switch>
    </Router>
  );
}
