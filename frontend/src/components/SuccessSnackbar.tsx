import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "common/Snackbar";
import { SyntheticEvent } from "react";

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
