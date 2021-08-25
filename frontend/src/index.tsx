import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import Navigation from "components/Navigation";
import "index.css";
// eslint-disable-next-line no-use-before-define
import React from "react";
import ReactDOM from "react-dom";

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
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <Navigation />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
