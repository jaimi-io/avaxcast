import renderer from "react-test-renderer";
import SvgLogo from "components/SvgLogo";
import { Provider } from "react-redux";
import store from "store";
import AvaxcastLogo from "images/avaxcast_logo.svg";
import BlackAvaxcastLogo from "images/avaxcast_black.svg";
import { BrowserRouter as Router } from "react-router-dom";

test("SvgLogo snapshot", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router>
          <SvgLogo lightIcon={BlackAvaxcastLogo} darkIcon={AvaxcastLogo} />
        </Router>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
