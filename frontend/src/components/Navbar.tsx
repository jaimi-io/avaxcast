import { Box, Grid, ListItemAvatar } from "@material-ui/core";
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
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

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
    },
    active: {
      backgroundColor: "#ae68fe",
      "&:hover": {
        backgroundColor: "#b595d2",
      },
      color: "white",
    },
  });
});

interface NavbarLinkProps {
  path: `/${string}`;
  text: string;
  icon: ReactNode;
}

/**
 * Generates a button navbar link used for navigation
 * @param props - {@link NavbarLinkProps}
 * @returns The NavbarLink Component
 */
function NavbarLink({ path, text, icon }: NavbarLinkProps): JSX.Element {
  const classes = useStyles();
  const location = useLocation();

  const getClassName = (path: `/${string}`): string => {
    let buttonClass = classes.button;
    if (location.pathname === path) {
      buttonClass += ` ${classes.active}`;
    }
    return buttonClass;
  };

  return (
    <Grid item xs>
      <Box textAlign="center">
        <LinkContainer to={path}>
          <Button
            variant="contained"
            color="inherit"
            className={getClassName(path)}
            startIcon={icon}>
            {text}
          </Button>
        </LinkContainer>
      </Box>
    </Grid>
  );
}

interface PropsT {
  fetchHoldings: () => Promise<void>;
}

/**
 * The Navbar used throughout the DApp
 * @param props - {@link PropsT}
 * @returns The Navbar Component
 */
function Navbar({ fetchHoldings }: PropsT): JSX.Element {
  const classes = useStyles();
  const isDark = useAppSelector((state) => state.isDark);
  const dispatch = useAppDispatch();

  const links: NavbarLinkProps[] = [
    { path: "/", text: "Vote", icon: <HowToVoteIcon /> },
    { path: "/portfolio", text: "Portfolio", icon: <BookIcon /> },
    { path: "/addmarket", text: "Add", icon: <LibraryAddIcon /> },
  ];

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs>
        <Box textAlign="left">
          <LinkContainer to={"/home"}>
            <ListItemAvatar>
              <SvgLogo
                lightIcon={BlackAvaxcastLogo}
                darkIcon={AvaxcastLogo}
                className={classes.svg}
              />
            </ListItemAvatar>
          </LinkContainer>
        </Box>
      </Grid>
      {links.map((link, index) => (
        <NavbarLink
          key={index}
          path={link.path}
          text={link.text}
          icon={link.icon}
        />
      ))}
      <Grid item xs>
        <Box textAlign="center">
          <Wallet fetchHoldings={fetchHoldings} />
        </Box>
      </Grid>
      <Grid item xs>
        <Box textAlign="right">
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
        </Box>
      </Grid>
    </Grid>
  );
}

export default Navbar;
