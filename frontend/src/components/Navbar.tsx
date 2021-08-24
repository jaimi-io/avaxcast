import { List, ListItem, ListItemText } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import BookIcon from "@material-ui/icons/Book";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

export default function Navbar(): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <List component="nav">
        <ListItem component="div">
          <ListItemText inset>
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              startIcon={<HowToVoteIcon />}>
              Vote
            </Button>
          </ListItemText>

          <ListItemText inset>
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              startIcon={<BookIcon />}>
              Portfolio
            </Button>
          </ListItemText>

          <ListItemText inset>
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              startIcon={<LibraryAddIcon />}>
              Add
            </Button>
          </ListItemText>

          <ListItemText inset>
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              startIcon={<AccountBalanceWalletIcon />}>
              Wallet
            </Button>
          </ListItemText>
        </ListItem>
      </List>
    </div>
  );
}
