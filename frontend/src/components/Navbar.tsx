import { List, ListItem, ListItemText } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import BookIcon from "@material-ui/icons/Book";
import Brightness6Icon from "@material-ui/icons/Brightness6";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import { LinkContainer } from "react-router-bootstrap";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import { lightOff, lightOn } from "actions";
import { useAppDispatch, useAppSelector } from "hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

export default function Navbar(): JSX.Element {
  const classes = useStyles();
  const isDark = useAppSelector((state) => state.isDark);
  const dispatch = useAppDispatch();

  return (
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
          <LinkContainer to="/addmarket">
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              startIcon={<LibraryAddIcon />}>
              Add
            </Button>
          </LinkContainer>
        </ListItemText>

        <ListItemText inset>
          <LinkContainer to="/wallet">
            <Button
              variant="contained"
              color="inherit"
              className={classes.button}
              startIcon={<AccountBalanceWalletIcon />}>
              Wallet
            </Button>
          </LinkContainer>
        </ListItemText>

        {isDark ? (
          <IconButton
            aria-label="dark"
            color="default"
            className={classes.button}
            onClick={() => dispatch(lightOn())}>
            <Brightness6Icon />
          </IconButton>
        ) : (
          <IconButton
            aria-label="dark"
            color="inherit"
            className={classes.button}
            onClick={() => dispatch(lightOff())}>
            <Brightness2Icon />
          </IconButton>
        )}
      </ListItem>
    </List>
  );
}
