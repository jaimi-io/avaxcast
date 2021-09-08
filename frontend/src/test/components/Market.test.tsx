import renderer from "react-test-renderer";
import Market from "components/Market";
import { Provider } from "react-redux";
import store from "store";
import { BrowserRouter as Router } from "react-router-dom";

test("Market snapshot", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router>
          <Market address={"0xdF5C5a3597f2B222a5e62828525624aaAAEB767D"} />
        </Router>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
