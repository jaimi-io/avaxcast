import { ListItemAvatar, ListItemText } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { getDate } from "common/date";
import Posts from "components/Posts";
import AvaxLogo from "images/avalanche-avax-logo.svg";
import BtcLogo from "images/bitcoin.svg";
import EthLogo from "images/ethereum.svg";
import LinkLogo from "images/link.svg";
import { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      // eslint-disable-next-line no-magic-numbers
      marginTop: theme.spacing(2),
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  })
);

interface NetworkDialogProps {
  open: boolean;
  onClose: () => void;
}

function NetworkDialog(props: NetworkDialogProps): JSX.Element {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Select Network</DialogTitle>
      <List>
        <ListItem
          button
          onClick={() => {
            handleClose();
          }}>
          <ListItemAvatar>
            <img src={AvaxLogo} width={"50px"} />
          </ListItemAvatar>
          <ListItemText primary={"AVAX"} />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            handleClose();
          }}>
          <ListItemAvatar>
            <img src={BtcLogo} width={"50px"} />
          </ListItemAvatar>
          <ListItemText primary={"BTC"} />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            handleClose();
          }}>
          <ListItemAvatar>
            <img src={EthLogo} width={"50px"} />
          </ListItemAvatar>
          <ListItemText primary={"ETH"} />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            handleClose();
          }}>
          <ListItemAvatar>
            <img src={LinkLogo} width={"50px"} />
          </ListItemAvatar>
          <ListItemText primary={"LINK"} />
        </ListItem>
      </List>
    </Dialog>
  );
}

export default function Markets(): JSX.Element {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Button onClick={handleClickOpen}>Select Network</Button>
        <NetworkDialog open={open} onClose={handleClose} />
      </FormControl>
      <FormControl className={classes.formControl}>
        <Select defaultValue="Open" labelId="open-select" id="open-select">
          <MenuItem value={"Open"}>Open</MenuItem>
          <MenuItem value={"Closed"}>Closed</MenuItem>
        </Select>
      </FormControl>
      <form className={classes.container} noValidate>
        <TextField
          id="date"
          label="Deadline"
          type="date"
          defaultValue={getDate()}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
      <Posts />
    </div>
  );
}
