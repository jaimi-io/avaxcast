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
          <MarketPlace
            contracts={[]}
            fetchContracts={function (): Promise<void> {
              throw new Error("Function not implemented.");
            }}
          />
        </Router>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
