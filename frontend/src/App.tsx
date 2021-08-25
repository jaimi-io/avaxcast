import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import Navigation from "components/Navigation";
import "index.css";
import { Provider } from "react-redux";
import allReducers from "reducers/";
import { createStore } from "redux";

function App(): JSX.Element {
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

  const store = createStore(allReducers);
  const lightTheme = createTheme({
    palette: {
      type: "light",
    },
  });
  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <Navigation />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
