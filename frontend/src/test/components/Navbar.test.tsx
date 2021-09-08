import renderer from "react-test-renderer";
import Navbar from "components/Navbar";
import { Provider } from "react-redux";
import store from "store";
import { BrowserRouter as Router } from "react-router-dom";

test("Navbar snapshot", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router>
          <Navbar />
        </Router>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
