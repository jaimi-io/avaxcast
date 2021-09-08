import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import BookIcon from "@material-ui/icons/Book";
import Brightness6Icon from "@material-ui/icons/Brightness6";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import { LinkContainer } from "react-router-bootstrap";
import Brightness2Icon from "@material-ui/icons/Brightness2";
import { lightOff, lightOn } from "actions";
import { useAppDispatch, useAppSelector } from "hooks";
import Wallet from "./Wallet";
import AvaxcastLogo from "images/avaxcast_logo.svg";
import BlackAvaxcastLogo from "images/avaxcast_black.svg";
import SvgLogo from "./SvgLogo";

const useStyles = makeStyles((theme: Theme) => {
  const SPACING = theme.spacing(1);
  return createStyles({
    svg: {
      width: 200,
      margin: SPACING,
    },
    icon: {
      margin: SPACING,
    },
    button: {
      margin: SPACING,
      minWidth: 110,
      // minHeight: 50,
    },
  });
});

/**
 * Navbar used throughout the DApp
 * @returns The Navbar Component
 */
function Navbar(): JSX.Element {
  const classes = useStyles();
  const isDark = useAppSelector((state) => state.isDark);
  const dispatch = useAppDispatch();

  return (
    <List component="nav">
      <ListItem component="div">
        <ListItemAvatar>
          <SvgLogo
            lightIcon={BlackAvaxcastLogo}
            darkIcon={AvaxcastLogo}
            className={classes.svg}
          />
        </ListItemAvatar>

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
          <Wallet />
        </ListItemText>

        {isDark ? (
          <IconButton
            aria-label="dark"
            color="default"
            className={classes.icon}
            onClick={() => dispatch(lightOn())}>
            <Brightness6Icon />
          </IconButton>
        ) : (
          <IconButton
            aria-label="dark"
            color="inherit"
            className={classes.icon}
            onClick={() => dispatch(lightOff())}>
            <Brightness2Icon />
          </IconButton>
        )}
      </ListItem>
    </List>
  );
}

export default Navbar;
