import renderer from "react-test-renderer";
import Wallet from "components/Wallet";
import { Provider } from "react-redux";
import store from "store";
import { BrowserRouter as Router } from "react-router-dom";

test("Wallet snapshot", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router>
          <Wallet
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
