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
          <Navbar
            fetchHoldings={function (): Promise<void> {
              throw new Error("Function not implemented.");
            }}
          />
        </Router>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
