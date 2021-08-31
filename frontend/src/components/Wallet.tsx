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

/*
  active: is a wallet actively connected right now?
  account: the blockchain address that is connected
  library: this is either web3 or ethers, depending what you passed in
  connector: the current connector. So, when we connect it will be the injected connector in this example
  activate: the method to connect to a wallet
  deactivate: the method to disconnect from a wallet 
*/

const avaxLocalId = 43112;
const avaxFujiId = 43113;

const injected = new InjectedConnector({
  supportedChainIds: [avaxLocalId, avaxFujiId],
});

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  button: {
    // margin: theme.spacing(1),
  },
});

interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  connect: () => Promise<void>;
}

function SimpleDialog(props: SimpleDialogProps): JSX.Element {
  const classes = useStyles();
  const { onClose, open, connect } = props;

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

function Wallet(): JSX.Element {
  const { active, activate } = useWeb3React();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
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
        startIcon={<AccountBalanceWalletIcon />}
        disabled={active}>
        {active ? "Wallet Connected" : "Wallet"}
      </Button>
      <SimpleDialog connect={connect} open={open} onClose={handleClose} />
    </div>
  );
}

export default Wallet;
