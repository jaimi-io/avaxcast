import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PublishIcon from "@material-ui/icons/Publish";
import { useWeb3React } from "@web3-react/core";
import { isLoading, notLoading } from "actions";
import { FLOAT_TO_SOL_NUM, MS_TO_SECS } from "common/constants";
import { getCurrentDateString } from "common/date";
import { Market } from "common/enums";
import { marketNames } from "common/markets";
import { insertContractAddress } from "common/skyDb";
import { handleSnackbarClose } from "common/Snackbar";
import Prediction from "contracts/PredictionMarket.json";
import { useAppDispatch } from "hooks";
import { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { AbiItem } from "web3-utils";
import Loading from "./Loading";
import SuccessSnackbar from "./SuccessSnackbar";
import { Grid } from "@material-ui/core";
import TradingView from "./TradingView";
import Fallback from "./Fallback";

/**
 * Determines if the market given is invalid
 * @param market - Current {@link Market} selected
 * @returns If the market is invalid
 */
function invalidMarket(market: number): boolean {
  return market === Market.ALL;
}

/**
 * Determines if the price given is invalid
 * @param price - Current predicted price selected
 * @returns If the price is invalid
 */
function invalidPrice(price: number): boolean {
  return price < 0 || isNaN(price);
}

/**
 * Determines if the date given is invalid
 * @param date - Current date selected
 * @returns If the date is invalid
 */
function invalidDate(date: string): boolean {
  const now = new Date();
  const selectedDate = new Date(date);
  return now >= selectedDate;
}

const useStyles = makeStyles((theme: Theme) => {
  const spacing = theme.spacing(1);
  const FILTER_MARGIN = "5%";
  return createStyles({
    root: {
      marginTop: FILTER_MARGIN,
      marginBottom: FILTER_MARGIN,
    },
    textField: {
      marginLeft: spacing,
      marginRight: spacing,
      width: "25ch",
    },
    formControl: {
      marginRight: spacing,
      minWidth: 120,
    },
    button: {
      minWidth: 120,
      maxHeight: 50,
    },
  });
});

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

/**
 * Input formatting for the predicted price
 * @param props - {@link NumberFormatCustomProps}
 * @returns The JSX.Element to format the price input
 */
function NumberFormatCustom(props: NumberFormatCustomProps): JSX.Element {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      decimalScale={2}
      thousandSeparator
      fixedDecimalScale
      isNumericString
      prefix="$"
    />
  );
}

/**
 * Input form to allow adding of Markets
 * @returns The AddMarket component
 */
function AddMarket(): JSX.Element {
  const classes = useStyles();
  const INITIAL_PREDICTED_PRICE = 0.0;
  const INITIAL_DATE = getCurrentDateString();
  const dispatch = useAppDispatch();
  // state
  const [market, setMarket] = useState(Market.ALL);
  const [predictedPrice, setPredictedPrice] = useState(INITIAL_PREDICTED_PRICE);
  const [deadline, setDeadline] = useState(INITIAL_DATE);
  const [invalid, setInvalid] = useState(true);
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { active, account, library } = useWeb3React();

  useEffect(() => {
    setInvalid(
      () =>
        invalidMarket(market) ||
        invalidPrice(predictedPrice) ||
        invalidDate(deadline) ||
        !active
    );
  }, [market, predictedPrice, deadline, active]);

  /**
   * Adds a market to SkyDB
   */
  const handleAddMarket = async () => {
    dispatch(isLoading());
    const contract = new library.eth.Contract(Prediction.abi as AbiItem[]);
    const unixDeadline = Math.floor(new Date(deadline).getTime() / MS_TO_SECS);
    await contract
      .deploy({
        data: Prediction.bytecode,
        arguments: [market, predictedPrice * FLOAT_TO_SOL_NUM, unixDeadline],
      })
      .send({ from: account })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(async (newContractInstance: any) => {
        await insertContractAddress(newContractInstance.options.address);
        setSuccess(true);
      })
      .catch(() => {
        setSuccess(false);
      });
    dispatch(notLoading());
    setOpenSnackbar(true);
  };

  if (!active) {
    return (
      <Fallback
        warning={"CONNECT YOUR WALLET"}
        isSnackbarOpen={true}
        handleSnackbarClose={handleSnackbarClose(setOpenSnackbar)}
        handleLoadingClose={() => dispatch(notLoading())}
      />
    );
  }

  return (
    <>
      <Grid container className={classes.root} justifyContent="center">
        <FormControl className={classes.formControl}>
          <Select
            defaultValue={Market.ALL}
            labelId="markets-select"
            id="markets-select"
            type="text"
            variant="outlined"
            error={invalidMarket(market)}
            onChange={(e) => setMarket(e.target.value as Market)}>
            {marketNames.map((mk, index) => (
              <MenuItem value={index} key={index}>
                {mk}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Predicted Price ($)"
          id="formatted-numberformat-input"
          defaultValue={INITIAL_PREDICTED_PRICE}
          className={classes.textField}
          onChange={(e) => setPredictedPrice(parseFloat(e.target.value))}
          error={invalidPrice(predictedPrice)}
          variant="outlined"
          helperText="Range $0 - $X"
          InputProps={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            inputComponent: NumberFormatCustom as any,
          }}
        />
        <form>
          <TextField
            id="date"
            label="Deadline"
            type="date"
            defaultValue={INITIAL_DATE}
            variant="outlined"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setDeadline(e.target.value)}
            error={invalidDate(deadline)}
            helperText={
              invalidDate(deadline)
                ? "Select a date after the current date"
                : ""
            }
          />
        </form>
        <Button
          variant="contained"
          color="inherit"
          className={classes.button}
          disabled={invalid}
          startIcon={<PublishIcon />}
          onClick={handleAddMarket}>
          Submit
        </Button>

        <SuccessSnackbar
          successMsg={"Successfully added!"}
          failMsg={"Failed to add."}
          success={success}
          open={openSnackbar}
          handleClose={handleSnackbarClose(setOpenSnackbar)}
        />
      </Grid>
      <TradingView market={market} />
      <Loading />
    </>
  );
}

export default AddMarket;
