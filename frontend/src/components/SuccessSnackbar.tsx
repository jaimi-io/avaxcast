import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { SyntheticEvent } from "react";

export function Alert(props: AlertProps): JSX.Element {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface PropsT {
  successMsg: string;
  failMsg: string;
  success: boolean;
  open: boolean;
  handleClose: (
    event?: SyntheticEvent<Element, Event> | undefined,
    reason?: string | undefined
  ) => void;
}

function SuccessSnackbar({
  successMsg,
  failMsg,
  success,
  open: openSnackbar,
  handleClose,
}: PropsT): JSX.Element {
  return (
    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={success ? "success" : "error"}>
        {success ? `${successMsg}` : `${failMsg}`}
      </Alert>
    </Snackbar>
  );
}

export default SuccessSnackbar;
