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
import { ReactNode, useEffect, useState } from "react";
import { fromWei, toBN } from "web3-utils";
import Loading from "./Loading";
import SuccessSnackbar from "./SuccessSnackbar";
import { isLoading, notLoading } from "actions";
import {
  doubleText,
  FULL_WIDTH,
  INFO_WIDTH,
  makeTextObj,
  PRICES_WIDTH,
  SHARES_WIDTH,
  singleText,
  TITLE_WIDTH,
  VOTES_WIDTH,
} from "common/generateText";
import { AttachMoney } from "@material-ui/icons";
import { PropTypes } from "@material-ui/core";

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
 * Detailed information regarding a Market
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
  }, [active]);

  useEffect(() => {
    setTotalPrice(priceOfShares());
  }, [numShares, isYesVote]);

  /**
   * Validates if the user can buy desired shares
   */
  useEffect(() => {
    setCanBuy(active && numShares > INVALID_NUM_SHARES && totalPrice.gtn(0));
  }, [active, numShares, totalPrice]);

  /**
   * Fetches the number of winning shares for a user
   * @returns Number of winning shares
   */
  const getWinningShares = () => {
    if (contract.winner === undefined) {
      return 0;
    }
    const userShares = [currentVotes.yesVotes, currentVotes.noVotes];
    return userShares[contract.winner];
  };

  /**
   * Generates the button & functionality for buying/withdrawing shares
   * @returns UI for contract action (buy or withdraw)
   */
  const contractActionButton = (isBuy: boolean) => {
    const disabled = isBuy ? !canBuy : getWinningShares() <= 0 || !active;
    // Transcation to buy or withdraw shares
    const transcation = isBuy ? buy : withdraw;

    const handleClick = async () => {
      dispatch(isLoading());
      await transcation(
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
    };

    return (
      <>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={disabled}
          onClick={handleClick}
          startIcon={isBuy ? <ShoppingCartIcon /> : <AttachMoney />}
        >
          {isBuy ? "Buy" : "Withdraw"}
        </Button>

        <SuccessSnackbar
          successMsg={`Successfully ${isBuy ? "bought" : "withdrawn"}!`}
          failMsg={"Transaction failed."}
          success={success}
          open={openSnackbar}
          handleClose={handleSnackbarClose(setOpenSnackbar)}
        />
        <Loading />
      </>
    );
  };

  /**
   * Generates the UI for buying shares
   */
  const buyShares = (
    <>
      {singleText(FULL_WIDTH, makeTextObj("p", "body1", "How many shares?"))}
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
      {singleText(
        FULL_WIDTH,
        makeTextObj(
          "p",
          "body1",
          `Total Price: ${fromWei(totalPrice, "ether")} AVAX`
        )
      )}
      <Grid item xs={12}>
        {contractActionButton(true)}
      </Grid>
    </>
  );

  /**
   * Generates the UI & functionality for withdrawing winning shares
   * @returns Withdraw Shares UI
   */
  const withdrawShares = () => {
    const winningSharesString = `${
      contract.winningPerShare === undefined
        ? "0"
        : fromWei(contract.winningPerShare)
    } AVAX`;

    const marketResolveMsg = `Market has resolved with ${
      contract.winner === undefined ? "" : voteString[contract.winner]
    } Votes Winning`;

    return (
      <>
        {singleText(FULL_WIDTH, makeTextObj("h3", "h6", marketResolveMsg))}

        <Grid item xs={FULL_WIDTH}>
          <Grid container justifyContent="flex-start">
            {singleText(
              INFO_WIDTH,
              makeTextObj("p", "body1", "Winning Shares:")
            )}
            {singleText(
              SHARES_WIDTH,
              makeTextObj("p", "body1", `${getWinningShares()}`)
            )}
          </Grid>
        </Grid>

        <Grid item xs={FULL_WIDTH}>
          <Grid container justifyContent="flex-start">
            {singleText(
              INFO_WIDTH,
              makeTextObj("p", "body1", "Winnings per Share:")
            )}
            {singleText(
              SHARES_WIDTH,
              makeTextObj("p", "body1", winningSharesString)
            )}
          </Grid>

          {contractActionButton(false)}
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
    return buyShares;
  };

  interface VoteVarsI {
    theme: Theme;
    price: BN;
    currentVotes: number;
    vote: Vote;
    icon: ReactNode;
  }

  /**
   * Generates the UI and functionality for picking a given prediction (Yes or No)
   * @param props - {@link VoteVarsI}
   * @returns UI for selecting a prediction
   */
  const generatePredictionUI = ({
    theme,
    price,
    currentVotes,
    vote,
    icon,
  }: VoteVarsI) => {
    const getButtonColour = (): PropTypes.Color => {
      if (vote === Vote.Yes && isYesVote) {
        return "primary";
      }
      if (vote === Vote.No && !isYesVote) {
        return "primary";
      }
      return "default";
    };
    return (
      <Grid item xs={PRICES_WIDTH}>
        <ThemeProvider theme={theme}>
          <Grid container>
            {doubleText(
              PRICES_WIDTH,
              makeTextObj("p", "body2", "Price"),
              makeTextObj("p", "body1", `${fromWei(price, "ether")} AVAX`)
            )}
            {doubleText(
              VOTES_WIDTH,
              makeTextObj("p", "body2", "Your Votes"),
              makeTextObj("p", "body1", `${currentVotes}`)
            )}
          </Grid>
          <Button
            variant="contained"
            color={getButtonColour()}
            className={classes.button}
            disabled={!active || contract.isResolved}
            onClick={() => setIsYesVote(vote === Vote.Yes)}
            startIcon={icon}
          >
            {voteString[vote]}
          </Button>
        </ThemeProvider>
      </Grid>
    );
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Grid container justifyContent="center">
            {singleText(
              TITLE_WIDTH,
              makeTextObj(
                "h1",
                "h6",
                `Will ${
                  marketNames[contract.market]
                } be greater than or equal to ${
                  contract.predictedPrice
                } on ${formattedDate}?`
              )
            )}
            {doubleText(
              INFO_WIDTH,
              makeTextObj("p", "body2", "Predicted Price"),
              makeTextObj("p", "body1", contract.predictedPrice)
            )}
            {doubleText(
              INFO_WIDTH,
              makeTextObj("p", "body2", "Deadline"),
              makeTextObj("p", "body1", deadline)
            )}
            {doubleText(
              INFO_WIDTH,
              makeTextObj("p", "body2", "Total Volume"),
              makeTextObj("p", "body1", `${fromWei(contract.volume)} AVAX`)
            )}
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container justifyContent="center">
            {generatePredictionUI({
              theme: yesTheme,
              price: contract.yesPrice,
              currentVotes: currentVotes.yesVotes,
              vote: Vote.Yes,
              icon: <CheckIcon />,
            })}
            {generatePredictionUI({
              theme: noTheme,
              price: contract.noPrice,
              currentVotes: currentVotes.noVotes,
              vote: Vote.No,
              icon: <CloseIcon />,
            })}
            {buyOrWithdraw()}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default Market;
