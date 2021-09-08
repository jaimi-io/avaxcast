import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

interface PropsT {
  isLoading: boolean;
  handleClose?: () => void;
}

/**
 * Loading circle to show the user data is in the process of being rendered
 * @param props - {@link PropsT}
 * @returns The Loading Component
 */
function Loading({ isLoading, handleClose }: PropsT): JSX.Element {
  const classes = useStyles();

  return (
    <Backdrop
      className={classes.backdrop}
      open={isLoading}
      onClick={handleClose}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Loading;
