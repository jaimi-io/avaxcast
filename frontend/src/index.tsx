import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import Navigation from "components/Navigation";
import "index.css";
// eslint-disable-next-line no-use-before-define
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import allReducers from "reducers/";
import { createStore } from "redux";

const store = createStore(allReducers);

// if (darkMode) {
//   document.body.classList.add("dark");
// } else {
//   document.body.classList.remove("dark");
// }

// const darkTheme = createTheme({
//   palette: {
//     type: "dark",
//   },
// });

const lightTheme = createTheme({
  palette: {
    type: "light",
  },
});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={lightTheme}>
        <Navigation />
      </ThemeProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
