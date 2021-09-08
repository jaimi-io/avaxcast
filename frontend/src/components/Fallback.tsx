import { Snackbar } from "@material-ui/core";
import { Alert } from "./SuccessSnackbar";
import Loading from "./Loading";
import NotFound from "./NotFound";
import { SyntheticEvent } from "react";

interface PropsT {
  warning?: string;
  isSnackbarOpen: boolean;
  handleSnackbarClose: (
    event?: SyntheticEvent<Element, Event> | undefined,
    reason?: string | undefined
  ) => void;
  loading: boolean;
  handleLoadingClose?: () => void;
}

function Fallback({
  warning,
  isSnackbarOpen,
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
