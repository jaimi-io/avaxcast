/* eslint-disable max-lines-per-function */
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { green, red } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import {
  createStyles,
  createTheme,
  makeStyles,
  Theme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { AttachMoney } from "@material-ui/icons";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useWeb3React } from "@web3-react/core";
import BN from "bn.js";
import { INVALID_NUM_SHARES, INVALID_PRICE } from "common/constants";
import {
  buy,
  getCurrentVotes,
  VotesPerPerson,
  withdraw,
} from "common/contract";
import { Vote } from "common/enums";
import { marketNames, voteString } from "common/markets";
import { handleSnackbarClose } from "common/Snackbar";
import { useFetchContract, useAppDispatch } from "hooks";
import { useEffect, useState } from "react";
import { fromWei, toBN } from "web3-utils";
import Loading from "./Loading";
import SuccessSnackbar from "./SuccessSnackbar";
import { isLoading, notLoading } from "actions";

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

/**
 * Deatiled information regarding a Market
 * @param props - {@link PropsT}
 * @returns The Market Component
 */
function Market({ address }: PropsT): JSX.Element {
  const classes = useStyles();
  const web3 = useWeb3React();
  const { active } = web3;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isYesVote, setIsYesVote] = useState(true);
  const contract = useFetchContract(address);
  const formattedDate = contract.date.toDateString();
  const deadline = contract.date.toUTCString();
  const [numShares, setNumShares] = useState(NaN);
  const [canBuy, setCanBuy] = useState(false);
  const [totalPrice, setTotalPrice] = useState(toBN(INVALID_PRICE));
  const [currentVotes, setCurrentVotes] = useState<VotesPerPerson>({
    yesVotes: 0,
    noVotes: 0,
  });
  const dispatch = useAppDispatch();

  /**
   * Gets the price of the shares selected
   * @returns Price of shares as a {@link BN}
   */
  const priceOfShares = (): BN => {
    const pricePerShare = isYesVote ? contract.yesPrice : contract.noPrice;
    if (isNaN(numShares)) {
      return toBN(INVALID_PRICE);
    }
    return pricePerShare.mul(toBN(numShares));
  };

  /**
   * Fetches the number of votes for the Market
   * @returns Number of votes
   */
  const fetchCurrentVotes = async () => {
    if (!active) {
      return;
    }
    const votes = await getCurrentVotes(address, web3);
    setCurrentVotes(votes);
  };

  useEffect(() => {
    fetchCurrentVotes();
  }, []);

  useEffect(() => {
    fetchCurrentVotes();
  }, [active]);

  useEffect(() => {
    setTotalPrice(priceOfShares());
  }, [numShares, isYesVote]);

  useEffect(() => {
    setCanBuy(active && numShares > INVALID_NUM_SHARES && totalPrice.gtn(0));
  }, [active, numShares, totalPrice]);

  const getWinningShares = () => {
    if (contract.winner === undefined) {
      return 0;
    }
    const userShares = [currentVotes.yesVotes, currentVotes.noVotes];
    return userShares[contract.winner];
  };

  /**
   * Generates the UI for share buying
   * @returns UI for buying shares
   */
  const buyShares = () => {
    return (
      <>
        <Grid item xs={12}>
          <Typography component="p">{"How many shares?"}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Input
            type="number"
            value={numShares}
            placeholder="0"
            onChange={(e) => {
              const newValue = parseInt(e.target.value);
              if (newValue < INVALID_NUM_SHARES) {
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
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={!canBuy}
            onClick={async () => {
              dispatch(isLoading());
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
              dispatch(notLoading());
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
            handleClose={handleSnackbarClose(setOpenSnackbar)}
          />

          <Loading />
        </Grid>
      </>
    );
  };

  /**
   * Generates the UI for withdrawing shares
   * @returns UI to withdraw shares
   */
  const withdrawShares = () => {
    return (
      <>
        <Grid item xs={12}>
          <Typography component="h3" variant="h6">{`Market has resolved with ${
            contract.winner === undefined ? "" : voteString[contract.winner]
          } Votes Winning`}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container justifyContent="flex-start">
            <Grid item xs={2}>
              <Typography component="p">{"Winning Shares:"}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography component="p">{getWinningShares()}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-start">
            <Grid item xs={2}>
              <Typography component="p">{"Winnings per Share:"}</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography component="p">
                {`${
                  contract.winningPerShare === undefined
                    ? "0"
                    : fromWei(contract.winningPerShare)
                } AVAX`}
              </Typography>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={getWinningShares() <= 0 || !active}
            onClick={async () => {
              dispatch(isLoading());
              await withdraw(contract.address, web3)
                .then(() => {
                  setSuccess(true);
                })
                .catch(() => {
                  setSuccess(false);
                });
              dispatch(notLoading());
              setOpenSnackbar(true);
            }}
            startIcon={<AttachMoney />}>
            Withdraw
          </Button>

          <SuccessSnackbar
            successMsg={"Successfully withdrawn!"}
            failMsg={"Transaction failed."}
            success={success}
            open={openSnackbar}
            handleClose={handleSnackbarClose(setOpenSnackbar)}
          />

          <Loading />
        </Grid>
      </>
    );
  };

  /**
   * Determines whether a market has been resolved to return Withdraw UI instead of Buy UI
   * @returns Buy or Withdraw UI
   */
  const buyOrWithdraw = () => {
    if (contract.isResolved) {
      return withdrawShares();
    }
    return buyShares();
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <Typography component="h1" variant="h6">
                {`Will ${
                  marketNames[contract.market]
                } be greater than or equal to ${
                  contract.predictedPrice
                } on ${formattedDate}?`}
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
                    {"Deadline"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography component="p">{deadline}</Typography>
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
                  <Typography component="p">{`${fromWei(
                    contract.volume
                  )} AVAX`}</Typography>
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
                  <Grid item xs={6}>
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
                  disabled={!active || contract.isResolved}
                  onClick={() => setIsYesVote(true)}
                  startIcon={<CheckIcon />}>
                  Yes
                </Button>
              </ThemeProvider>
            </Grid>
            <Grid item xs={6}>
              <ThemeProvider theme={noTheme}>
                <Grid container>
                  <Grid item xs={6}>
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
                  disabled={!active || contract.isResolved}
                  onClick={() => setIsYesVote(false)}
                  startIcon={<CloseIcon />}>
                  No
                </Button>
              </ThemeProvider>
            </Grid>
            {buyOrWithdraw()}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default Market;
