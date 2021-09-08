import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

/**
 *
 * @param props - Props for MuiAlert
 * @returns MuiAlert used for Snackbars
 */
export function Alert(props: AlertProps): JSX.Element {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * Handles the closing of Snackbar
 * @param setOpenSnackbar - Set function for the Snackbar to be open
 * @returns The function to handle closing a Snackbar
 */
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
