import renderer from "react-test-renderer";
import AddMarket from "components/AddMarket";
import { Provider } from "react-redux";
import store from "store";
import { BrowserRouter as Router } from "react-router-dom";

test("AddMarket snapshot", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router>
          <AddMarket />
        </Router>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
