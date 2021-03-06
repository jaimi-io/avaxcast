import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  makeStyles,
  Button,
  ListItemIcon,
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import MetaMaskIcon from "images/metamask.svg";
import { createStyles, Theme } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import SuccessSnackbar from "./SuccessSnackbar";
import { handleSnackbarClose } from "common/Snackbar";

const FIFTH_DIGIT = 5;
const LAST_DIGIT = -1;
const AVAX_FUJI_ID = 43113;
const injected = new InjectedConnector({
  supportedChainIds: [AVAX_FUJI_ID],
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: blue[100],
      color: blue[600],
    },
    button: {
      margin: theme.spacing(1),
    },
  })
);

interface WalletConnectProps {
  open: boolean;
  connect: () => Promise<void>;
  onClose: () => void;
}

/**
 * Dialog to connect the user's wallet
 * @param props - {@link WalletConnectProps}
 * @returns Wallet Connect Dialog Component
 */
function WalletConnectDialog(props: WalletConnectProps): JSX.Element {
  const classes = useStyles();
  const { open, connect, onClose } = props;

  const onClick = () => {
    connect();
    onClose();
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Connect Wallet</DialogTitle>
      <List>
        <ListItem button onClick={onClick}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <img src={MetaMaskIcon} width={"35px"} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={"Connect to Metamask"} />
        </ListItem>
      </List>
    </Dialog>
  );
}

interface WalletDisconnectProps {
  open: boolean;
  onClose: () => void;
  disconnect: () => void;
}

/**
 * Dialog warning for disconnecting the user's wallet
 * @param props - {@link WalletDisconnectProp}
 * @returns Wallet Disconnect Dialog Component
 */
function WalletDisconnectDialog(props: WalletDisconnectProps): JSX.Element {
  const { open, disconnect, onClose } = props;

  const handleClose = () => {
    disconnect();
    onClose();
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">
        Are you sure you want to disconnect your wallet?
      </DialogTitle>
      <List>
        <ListItem button onClick={handleClose}>
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText primary={"Yes"} />
        </ListItem>
        <ListItem button onClick={onClose}>
          <ListItemIcon>
            <CloseIcon />
          </ListItemIcon>
          <ListItemText primary={"No"} />
        </ListItem>
      </List>
    </Dialog>
  );
}

/**
 * Changes the address to the format of 0xABC...4 to be displayed
 * @param account - The address of the wallet connected
 * @returns Formatted address
 */
function displayAccount(account: string | null | undefined): string {
  if (!account) {
    return "ADDRESS NOT FOUND";
  }
  return `${account.substring(0, FIFTH_DIGIT)}...${account.slice(LAST_DIGIT)}`;
}

interface PropsT {
  fetchHoldings: () => Promise<void>;
}

/**
 * Wallet used to interact on the AVAX C-chain
 * @returns The Wallet Component
 */
function Wallet({ fetchHoldings }: PropsT): JSX.Element {
  const classes = useStyles();
  const { active, account, activate, deactivate } = useWeb3React();
  const [openConnect, setOpenConnect] = useState(false);
  const [openDisconnect, setOpenDisconnect] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchHoldings();
  }, [active]);

  const handleClickOpen = () => {
    if (active) {
      setOpenDisconnect(true);
    } else {
      setOpenConnect(true);
    }
  };

  async function connect() {
    await activate(injected)
      .then(() => setSuccess(true))
      .catch(() => setSuccess(false));
    setOpenSnackbar(true);
  }

  return (
    <>
      <Button
        variant="contained"
        color="inherit"
        onClick={handleClickOpen}
        className={classes.button}
        startIcon={<AccountBalanceWalletIcon />}>
        {active ? `${displayAccount(account)}` : "Wallet"}
      </Button>
      <WalletConnectDialog
        open={openConnect}
        connect={connect}
        onClose={() => setOpenConnect(false)}
      />
      <WalletDisconnectDialog
        open={openDisconnect}
        disconnect={deactivate}
        onClose={() => setOpenDisconnect(false)}
      />

      <SuccessSnackbar
        successMsg={"Wallet Connected!"}
        failMsg={"Wallet Connection Failed"}
        success={success}
        open={openSnackbar}
        handleClose={handleSnackbarClose(setOpenSnackbar)}
      />
    </>
  );
}

export default Wallet;
