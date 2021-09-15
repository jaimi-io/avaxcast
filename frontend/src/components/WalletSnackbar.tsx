import { Snackbar } from "@material-ui/core";
import { Alert } from "common/Snackbar";

interface WalletSnackbarProps {
  open: boolean;
  handleClose: () => void;
}

/**
 * Dialog warning for submitting a market with no wallet connected
 * @param props - {@link WalletSnackbarProps}
 * @returns Wallet Snackbar Component
 */
function WalletSnackbar({
  open,
  handleClose,
}: WalletSnackbarProps): JSX.Element {
  return (
    <Snackbar open={open} onClose={handleClose}>
      <Alert onClose={handleClose} severity="warning">
        CONNECT YOUR WALLET
      </Alert>
    </Snackbar>
  );
}

export default WalletSnackbar;
