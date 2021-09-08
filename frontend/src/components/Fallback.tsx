import { Snackbar } from "@material-ui/core";
import { Alert } from "common/Snackbar";
import { SyntheticEvent } from "react";
import Loading from "./Loading";
import NotFound from "./NotFound";

interface PropsT {
  warning?: string;
  isSnackbarOpen?: boolean;
  handleSnackbarClose?: (
    event?: SyntheticEvent<Element, Event> | undefined,
    reason?: string | undefined
  ) => void;
  loading: boolean;
  handleLoadingClose?: () => void;
}

/**
 * Fallback for data that has not been rendered on screen
 * @param props - {@link PropsT}
 * @returns The Fallback component
 */
function Fallback({
  warning,
  isSnackbarOpen = false,
  handleSnackbarClose,
  loading,
  handleLoadingClose,
}: PropsT): JSX.Element {
  return (
    <>
      <NotFound />
      <Snackbar open={isSnackbarOpen} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="warning">
          {warning}
        </Alert>
      </Snackbar>
      <Loading isLoading={loading} handleClose={handleLoadingClose} />
    </>
  );
}

export default Fallback;
