import { Snackbar } from "@material-ui/core";
import { Alert } from "common/Snackbar";

interface PropsT {
  open: boolean;
  handleClose: () => void;
}

function WalletSnackbar({ open, handleClose }: PropsT): JSX.Element {
  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert onClose={handleClose} severity="warning">
        CONNECT YOUR WALLET
      </Alert>
    </Snackbar>
  );
}

export default WalletSnackbar;
