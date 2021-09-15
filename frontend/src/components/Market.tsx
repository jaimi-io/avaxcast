import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { green, red } from "@material-ui/core/colors";
import Grid, { GridSize } from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import {
  createStyles,
  createTheme,
  makeStyles,
  Theme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useWeb3React } from "@web3-react/core";
import BN from "bn.js";
import { INVALID_NUM_SHARES, INVALID_PRICE } from "common/constants";
import {
  buy,
  ContractI,
  getCurrentVotes,
  VotesPerPerson,
  withdraw,
} from "common/contract";
import { Vote } from "common/enums";
import { marketNames, voteString } from "common/markets";
import { handleSnackbarClose } from "common/Snackbar";
import { useFetchContract, useAppDispatch } from "hooks";
import {
  Dispatch,
  ElementType,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { fromWei, toBN } from "web3-utils";
import Loading from "./Loading";
import SuccessSnackbar from "./SuccessSnackbar";
import { isLoading, notLoading } from "actions";
import { Variant } from "@material-ui/core/styles/createTypography";
import { AttachMoney } from "@material-ui/icons";

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

interface TextT {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ElementType<any>;
  variant: Variant;
  text: string;
}

/**
 * Helper function to generate a text object of type {@link TextT}
 * @param component - Component passed to Typography (e.g. 'h1')
 * @param variant - Variant passed to Typography (e.g. 'body1')
 * @param text - The string to display
 * @returns Text Object of type {@link TextT}
 */
const makeTextObj = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ElementType<any>,
  variant: Variant,
  text: string
): TextT => {
  return {
    component: component,
    variant: variant,
    text: text,
  };
};

// Constants used for grid size
const FULL_WIDTH = 12;
const PRICES_WIDTH = 6;
const TITLE_WIDTH = 6;
const VOTES_WIDTH = 4;
const INFO_WIDTH = 2;
const SHARES_WIDTH = 1;

/**
 * Generates a grid with one set of typography
 * @param gridSize - The size of MaterialUI grid
 * @param text - The text object, passed to Typography as props
 * @returns UI for a Grid with text within
 */
const singleText = (gridSize: GridSize, text: TextT) => {
  return (
    <Grid item xs={gridSize}>
      <Typography component={text.component} variant={text.variant}>
        {text.text}
      </Typography>
    </Grid>
  );
};

/**
 * Generates a grid with two sets of typography
 * @param gridSize - The size of MaterialUI grid
 * @param text1 - The first text object {@link TextT}, passed to Typography as props
 * @param text2 - The second text object {@link TextT}, passed to Typography as props
 * @returns UI for a Grid with two sets of text within
 */
const doubleText = (gridSize: GridSize, text1: TextT, text2: TextT) => {
  return (
    <Grid item xs={gridSize}>
      <Typography component={text1.component} variant={text1.variant}>
        {text1.text}
      </Typography>
      <Typography component={text2.component} variant={text2.variant}>
        {text2.text}
      </Typography>
    </Grid>
  );
};

interface WithdrawSharesProps {
  contract: ContractI;
  winningShares: number;
  success: boolean;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  openSnackbar: boolean;
  setOpenSnackbar: Dispatch<SetStateAction<boolean>>;
}

/**
 * Generates UI with button and functionality to withdraw any winning shares
 * @param props - {@link WithdrawSharesProps}
 * @returns The WithdrawShares Component
 */
function WithdrawShares({
  contract,
  winningShares,
  success,
  setSuccess,
  openSnackbar,
  setOpenSnackbar,
}: WithdrawSharesProps): JSX.Element {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const web3 = useWeb3React();
  const { active } = web3;

  const winningSharesString = `${
    contract.winningPerShare === undefined
      ? "0"
      : fromWei(contract.winningPerShare)
  } AVAX`;

  return (
    <>
      <Grid item xs={12}>
        <Typography component="h3" variant="h6">{`Market has resolved with ${
          contract.winner === undefined ? "" : voteString[contract.winner]
        } Votes Winning`}</Typography>
      </Grid>

      <Grid item xs={FULL_WIDTH}>
        <Grid container justifyContent="flex-start">
          {singleText(INFO_WIDTH, makeTextObj("p", "body1", "Winning Shares:"))}
          {singleText(
            SHARES_WIDTH,
            makeTextObj("p", "body1", `${winningShares}`)
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
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          disabled={winningShares <= 0 || !active}
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
}

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
   * Generates the UI for share buying
   * @returns UI for buying shares
   */
  const buyShares = () => {
    return (
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
   * Determines whether a market has been resolved to return Withdraw UI instead of Buy UI
   * @returns Buy or Withdraw UI
   */
  const buyOrWithdraw = () => {
    if (contract.isResolved) {
      return (
        <WithdrawShares
          contract={contract}
          winningShares={getWinningShares()}
          success={success}
          setSuccess={setSuccess}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
        />
      );
    }
    return buyShares();
  };

  const fullMarketName = `Will ${
    marketNames[contract.market]
  } be greater than or equal to ${
    contract.predictedPrice
  } on ${formattedDate}?`;

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
    const getButtonColour = () => {
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
            startIcon={icon}>
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
            {singleText(TITLE_WIDTH, makeTextObj("h1", "h6", fullMarketName))}
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
