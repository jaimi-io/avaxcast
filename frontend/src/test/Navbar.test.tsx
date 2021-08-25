import { render } from "@testing-library/react";
import Navbar from "components/Navbar";
import { Provider } from "react-redux";
import store from "store";
import { BrowserRouter as Router } from "react-router-dom";

test("renders learn react link", () => {
  render(
    <Provider store={store}>
      <Router>
        <Navbar />
      </Router>
    </Provider>
  );
});
