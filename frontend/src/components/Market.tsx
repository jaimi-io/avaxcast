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
import {
  buy,
  ContractI,
  getContractInfo,
  getCurrentVotes,
  VotesPerPerson,
} from "common/contract";
import { marketNames } from "common/markets";
import Input from "@material-ui/core/Input";
import { Vote } from "common/enums";
import { fromWei, toBN } from "web3-utils";
import BN from "bn.js";
import { UNDEFINED_NUM_SHARES, UNDEFINED_PRICE } from "common/constants";
import SuccessSnackbar from "./SuccessSnackbar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      minHeight: 50,
      minWidth: 150,
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isYesVote, setIsYesVote] = useState(true);
  const [contract, setContract] = useState<ContractI>({
    market: 0,
    predictedPrice: "$X",
    date: new Date(),
    volume: 0,
    yesPrice: toBN(UNDEFINED_PRICE),
    noPrice: toBN(UNDEFINED_PRICE),
    address: address,
    isResolved: false,
  });
  const formattedDate = contract.date.toDateString();
  const [numShares, setNumShares] = useState(UNDEFINED_NUM_SHARES);
  const [canBuy, setCanBuy] = useState(false);
  const [totalPrice, setTotalPrice] = useState(toBN(UNDEFINED_PRICE));
  const [currentVotes, setCurrentVotes] = useState<VotesPerPerson>({
    yesVotes: 0,
    noVotes: 0,
  });

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const priceOfShares = (): BN => {
    const pricePerShare = isYesVote ? contract.yesPrice : contract.noPrice;
    return pricePerShare.mul(toBN(numShares));
  };

  const fetchCurrentVotes = async () => {
    if (!active) {
      return;
    }
    const votes = await getCurrentVotes(address, web3);
    setCurrentVotes(votes);
  };

  useEffect(() => {
    getContractInfo(address, setContract);
    fetchCurrentVotes();
  }, []);

  useEffect(() => {
    fetchCurrentVotes();
  }, [active]);

  useEffect(() => {
    setTotalPrice(priceOfShares());
  }, [numShares, isYesVote]);

  useEffect(() => {
    setCanBuy(active && numShares > UNDEFINED_NUM_SHARES && totalPrice.gtn(0));
  }, [active, numShares, totalPrice]);

  const buyButton = () => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={!canBuy}
          onClick={async () => {
            await buy(
              contract.address,
              web3,
              isYesVote ? Vote.Yes : Vote.No,
              priceOfShares()
            )
              .then(() => {
                setSuccess(true);
              })
              .catch(() => {
                setSuccess(false);
              });
            setOpenSnackbar(true);
          }}
          startIcon={<ShoppingCartIcon />}>
          Buy
        </Button>
        <SuccessSnackbar
          successMsg={"Successfully bought!"}
          failMsg={"Transaction failed."}
          success={success}
          open={openSnackbar}
          handleClose={handleClose}
        />
      </>
    );
  };

  const withdrawButton = () => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={!canBuy}
          onClick={async () => {
            await buy(
              contract.address,
              web3,
              isYesVote ? Vote.Yes : Vote.No,
              priceOfShares()
            )
              .then(() => {
                setSuccess(true);
              })
              .catch(() => {
                setSuccess(false);
              });
            setOpenSnackbar(true);
          }}
          startIcon={<ShoppingCartIcon />}>
          Withdraw
        </Button>
        <SuccessSnackbar
          successMsg={"Successfully bought!"}
          failMsg={"Transaction failed."}
          success={success}
          open={openSnackbar}
          handleClose={handleClose}
        />
      </>
    );
  };

  const finalButton = () => {
    if (contract.isResolved) {
      return withdrawButton();
    }
    return buyButton();
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <Typography component="h1" variant="h6">
                {`Will ${marketNames[contract.market]} reach ${
                  contract.predictedPrice
                } by ${formattedDate}?`}
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
                  <Typography component="p">{formattedDate}</Typography>
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
            <Grid item xs={6}>
              <ThemeProvider theme={yesTheme}>
                <Grid container>
                  <Grid item xs={3}>
                    <Typography variant="body2" component="p">
                      {"Price"}
                    </Typography>
                    <Typography component="p">{`${fromWei(
                      contract.yesPrice,
                      "ether"
                    )} AVAX`}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" component="p">
                      {"Your Votes"}
                    </Typography>
                    <Typography component="p">
                      {currentVotes.yesVotes}
                    </Typography>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color={isYesVote ? "primary" : "default"}
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
                <Grid container>
                  <Grid item xs={3}>
                    <Typography variant="body2" component="p">
                      {"Price"}
                    </Typography>
                    <Typography component="p">{`${fromWei(
                      contract.noPrice,
                      "ether"
                    )} AVAX`}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" component="p">
                      {"Your Votes"}
                    </Typography>
                    <Typography component="p">
                      {currentVotes.noVotes}
                    </Typography>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color={isYesVote ? "default" : "primary"}
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
            <Grid item xs={12}>
              <Input
                type="number"
                value={numShares}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  if (
                    (!newValue && newValue !== UNDEFINED_NUM_SHARES) ||
                    newValue < UNDEFINED_NUM_SHARES
                  ) {
                    return;
                  }
                  setNumShares(newValue);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="p">{`Total Price: ${fromWei(
                totalPrice,
                "ether"
              )} AVAX`}</Typography>
            </Grid>
            <Grid item xs={12}>
              {finalButton()}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default Market;
