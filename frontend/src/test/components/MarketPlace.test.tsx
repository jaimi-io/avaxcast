import renderer from "react-test-renderer";
import MarketPlace from "components/MarketPlace";
import { Provider } from "react-redux";
import store from "store";
import { BrowserRouter as Router } from "react-router-dom";

test("MarketPlace snapshot", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router>
          <MarketPlace />
        </Router>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
