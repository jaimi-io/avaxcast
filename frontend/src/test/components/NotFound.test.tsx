import renderer from "react-test-renderer";
import NotFound from "components/NotFound";
import { Provider } from "react-redux";
import store from "store";
import { BrowserRouter as Router } from "react-router-dom";

test("NotFound snapshot", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router>
          <NotFound />
        </Router>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
