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
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState } from "react";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import MetaMaskIcon from "images/metamask.svg";
import { createStyles, Theme } from "@material-ui/core/styles";

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

interface WalletDialogProps {
  open: boolean;
  connect: () => Promise<void>;
  onClose: () => void;
}

/**
 * Dialog to connect the user's wallet
 * @param props - {@link WalletDialogProps}
 * @returns Wallet Dialog Component
 */
function WalletDialog(props: WalletDialogProps): JSX.Element {
  const classes = useStyles();
  const { open, connect, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Connect Wallet</DialogTitle>
      <List>
        <ListItem
          button
          onClick={() => {
            connect();
            handleClose();
          }}>
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

const FIFTH_DIGIT = 5;
const LAST_DIGIT = -1;

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

const AVAX_LOCAL_ID = 43112;
const AVAX_FUJI_ID = 43113;
const injected = new InjectedConnector({
  supportedChainIds: [AVAX_LOCAL_ID, AVAX_FUJI_ID],
});

/**
 * Wallet used to interact on the AVAX C-chain
 * @returns The Wallet Component
 */
function Wallet(): JSX.Element {
  const classes = useStyles();
  const { active, account, activate, deactivate } = useWeb3React();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (active) {
      deactivate();
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function connect() {
    await activate(injected).catch(console.error);
  }

  return (
    <div>
      <Button
        variant="contained"
        color="inherit"
        onClick={handleClickOpen}
        className={classes.button}
        startIcon={<AccountBalanceWalletIcon />}>
        {active ? `${displayAccount(account)}` : "Wallet"}
      </Button>
      <WalletDialog open={open} connect={connect} onClose={handleClose} />
    </div>
  );
}

export default Wallet;
