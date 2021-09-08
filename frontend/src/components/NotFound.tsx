import { createStyles, makeStyles } from "@material-ui/core/styles";
import NothingHereLogo from "images/nothing_here.svg";
import NothingHereLogoBlack from "images/nothing_here_black.svg";
import SvgLogo from "./SvgLogo";

const useStyles = makeStyles(() =>
  createStyles({
    svg: {
      maxWidth: 700,
      maxHeight: 700,
      display: "flex",
      margin: "auto",
    },
  })
);

/**
 * Used for when data can be found i.e. 404 page
 * @returns The NotFound Component
 */
function NotFound(): JSX.Element {
  const classes = useStyles();
  return (
    <SvgLogo
      darkIcon={NothingHereLogo}
      lightIcon={NothingHereLogoBlack}
      className={classes.svg}
    />
  );
}

export default NotFound;
