import {
  Grid,
  Typography,
  makeStyles,
  createStyles,
  Theme,
  Button,
  Paper,
} from "@material-ui/core";
import SvgLogo from "./SvgLogo";
import AvaxcastText from "images/avaxcast_text_colour.svg";
import BlackAvaxcastText from "images/avaxcast_text_black.svg";
import InfoTab from "./InfoTab";
import { LinkContainer } from "react-router-bootstrap";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      padding: theme.spacing(5),
      textAlign: "center",
      color: theme.palette.text.primary,
    },
    title: {
      fontWeight: 500,
      paddingBottom: theme.spacing(3),
    },
    svg: {
      width: 300,
      margin: theme.spacing(2),
    },
    voteButton: {
      backgroundColor: "#ae68fe",
      "&:hover": {
        backgroundColor: "#b595d2",
      },
      color: "white",
    },
    paper: {
      marginRight: "5%",
      marginLeft: "5%",
      justifyContent: "center",
    },
  })
);

function Home(): JSX.Element {
  const classes = useStyles();

  return (
    <>
      <Grid container justifyContent="center" className={classes.grid}>
        <Grid item xs={12}>
          <SvgLogo
            lightIcon={BlackAvaxcastText}
            darkIcon={AvaxcastText}
            className={classes.svg}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography component="h1" variant="h4" className={classes.title}>
            {"A Price Prediction Marketplace on Avalanche"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LinkContainer to={"/"}>
            <Button
              variant="contained"
              className={classes.voteButton}
              size="large">
              CAST YOUR VOTE
            </Button>
          </LinkContainer>
        </Grid>
      </Grid>
      <Paper variant="outlined" className={classes.paper}>
        <Grid container justifyContent="center" className={classes.grid}>
          <Grid item xs={12}>
            <Typography component="h2" variant="h5" className={classes.title}>
              {"HOW IT WORKS?"}
            </Typography>
          </Grid>
          <InfoTab />
        </Grid>
      </Paper>
    </>
  );
}

export default Home;
