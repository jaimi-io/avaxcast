import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export function Alert(props: AlertProps): JSX.Element {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function handleSnackbarClose(
  setOpenSnackbar: Dispatch<SetStateAction<boolean>>
): (
  event?: SyntheticEvent<Element, Event> | undefined,
  reason?: string | undefined
) => void {
  return (event?: SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
}
