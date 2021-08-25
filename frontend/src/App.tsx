import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import Navigation from "components/Navigation";
import "App.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function App(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const isDark = useSelector((state) => state.isDark);

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
