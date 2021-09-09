import renderer from "react-test-renderer";
import Posts from "components/Posts";
import { Provider } from "react-redux";
import store from "store";
import { BrowserRouter as Router } from "react-router-dom";

test("Posts snapshot", () => {
  const tree = renderer
    .create(
      <Provider store={store}>
        <Router>
          <Posts contracts={[]} deadlineFilter={["", ""]} />
        </Router>
      </Provider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
