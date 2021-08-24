// eslint-disable-next-line no-use-before-define
import React from "react";
import Navbar from "components/Navbar";
import ReactDOM from "react-dom";
import Navigation from "components/Navigation";

ReactDOM.render(
  <React.StrictMode>
    <Navbar />
    <Navigation />
  </React.StrictMode>,
  document.getElementById("root")
);
