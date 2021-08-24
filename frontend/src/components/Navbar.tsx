import { List, ListItem, ListItemText } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import BookIcon from "@material-ui/icons/Book";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import { LinkContainer } from "react-router-bootstrap";
import { BrowserRouter as Router } from "react-router-dom";

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
    <Router>
      <List component="nav">
        <ListItem component="div">
          <ListItemText inset>
            <LinkContainer to="/">
              <Button
                variant="contained"
                color="inherit"
                className={classes.button}
                startIcon={<HowToVoteIcon />}>
                Vote
              </Button>
            </LinkContainer>
          </ListItemText>

          <ListItemText inset>
            <LinkContainer to="/portfolio">
              <Button
                variant="contained"
                color="inherit"
                className={classes.button}
                startIcon={<BookIcon />}>
                Portfolio
              </Button>
            </LinkContainer>
          </ListItemText>

          <ListItemText inset>
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              disabled
              startIcon={<LibraryAddIcon />}>
              Add
            </Button>
          </ListItemText>

          <ListItemText inset>
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              disabled
              startIcon={<AccountBalanceWalletIcon />}>
              Wallet
            </Button>
          </ListItemText>
        </ListItem>
      </List>
    </Router>
  );
}