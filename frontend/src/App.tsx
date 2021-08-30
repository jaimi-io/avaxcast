import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import Navigation from "components/Navigation";
import "App.css";
import { useEffect } from "react";
import { useAppSelector } from "hooks";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

function App(): JSX.Element {
  const isDark = useAppSelector((state) => state.isDark);

  function getLibrary(provider: string) {
    return new Web3(provider);
  }

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  const darkTheme = createTheme({
    palette: {
      type: "dark",
    },
  });

  const lightTheme = createTheme({
    palette: {
      type: "light",
    },
  });

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <Navigation />
      </ThemeProvider>
    </Web3ReactProvider>
  );
}

export default App;
