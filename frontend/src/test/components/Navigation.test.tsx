import renderer from "react-test-renderer";
import Navigation from "components/Navigation";
import { Provider } from "react-redux";
import store from "store";
// import { BrowserRouter as Router } from "react-router-dom";

test("Navigation snapshot", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        {/* <Router> */}
        <Navigation />
        {/* </Router> */}
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
