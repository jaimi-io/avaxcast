import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  createTheme,
  makeStyles,
  Theme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { useWeb3React } from "@web3-react/core";
import { green, red } from "@material-ui/core/colors";
import { useState, useEffect } from "react";
import { ContractI, getContractInfo } from "common/contract";
import { marketNames } from "common/markets";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

const yesTheme = createTheme({
  palette: {
    primary: green,
  },
});

const noTheme = createTheme({
  palette: {
    primary: red,
  },
});

interface PropsT {
  address: string;
}

function Market({ address }: PropsT): JSX.Element {
  const classes = useStyles();
  const web3 = useWeb3React();
  const { active } = web3;
  const [isYesVote, setIsYesVote] = useState(true);
  const [contract, setContract] = useState<ContractI>({
    market: 0,
    predictedPrice: "",
    date: "",
    volume: "",
    yesPrice: "",
    noPrice: "",
    address: address,
  });

  useEffect(() => {
    getContractInfo(address, web3, setContract);
  }, [active]);

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <Typography component="h1" variant="h6">
                {`Will ${marketNames[contract.market]} reach ${
                  contract.predictedPrice
                } by ${contract.date}?`}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body2" component="p">
                    {"Predicted Price"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p">
                    {contract.predictedPrice}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body2" component="p">
                    {"End Date"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p">{contract.date}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body2" component="p">
                    {"Total Volume"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p">{contract.volume}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Typography component="p">{"Pick outcome:"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <ThemeProvider theme={yesTheme}>
                <Button
                  variant="contained"
                  color={isYesVote ? "primary" : "inherit"}
                  className={classes.button}
                  disabled={!active}
                  onClick={() => setIsYesVote(true)}
                  startIcon={<CheckIcon />}>
                  Yes
                </Button>
              </ThemeProvider>
            </Grid>
            <Grid item xs={6}>
              <ThemeProvider theme={noTheme}>
                <Button
                  variant="contained"
                  color={isYesVote ? "inherit" : "primary"}
                  className={classes.button}
                  disabled={!active}
                  onClick={() => setIsYesVote(false)}
                  startIcon={<CloseIcon />}>
                  No
                </Button>
              </ThemeProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography component="p">{"How many shares?"}</Typography>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Typography component="p">{"Total Price: $X.XX"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="inherit"
                className={classes.button}
                disabled={!active}
                startIcon={<ShoppingCartIcon />}>
                Buy
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default Market;
