import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import Navigation from "components/Navigation";
import "App.css";
import { useEffect } from "react";
import { useAppSelector } from "hooks";

/**
 * The DApp
 * @returns The App Component
 */
function App(): JSX.Element {
  const isDark = useAppSelector((state) => state.isDark);

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
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Navigation />
    </ThemeProvider>
  );
}

export default App;
