import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useAppSelector } from "hooks";
import NothingHereLogo from "images/nothing_here.svg";
import NothingHereLogoBlack from "images/nothing_here_black.svg";

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

function NotFound(): JSX.Element {
  const classes = useStyles();
  const isDark = useAppSelector((state) => state.isDark);
  return (
    <img
      src={isDark ? NothingHereLogo : NothingHereLogoBlack}
      className={classes.svg}
    />
  );
}

export default NotFound;
