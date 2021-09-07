import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import PublishIcon from "@material-ui/icons/Publish";
import { useWeb3React } from "@web3-react/core";
import { FLOAT_TO_SOL_NUM, MS_TO_SECS } from "common/constants";
import { getDate } from "common/date";
import Market from "common/enums";
import { marketNames } from "common/markets";
import { insertContractAddress } from "common/skyDb";
import Prediction from "contracts/PredictionMarket.json";
import { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { AbiItem } from "web3-utils";

const MIN_PREDICTED_PRICE = 0;

function invalidMarket(market: number): boolean {
  return market === Market.ALL;
}

function invalidPrice(price: number): boolean {
  return price <= MIN_PREDICTED_PRICE;
}

function invalidDate(date: string): boolean {
  const now = new Date();
  const selectedDate = new Date(date);
  return now >= selectedDate;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: "25ch",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    button: {
      margin: theme.spacing(1),
    },
  })
);

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
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

function AddMarket(): JSX.Element {
  const classes = useStyles();
  const INITIAL_PREDICTED_PRICE = 0.0;
  const INITIAL_DATE = getDate();
  // state
  const [market, setMarket] = useState(Market.ALL);
  const [predictedPrice, setPredictedPrice] = useState(INITIAL_PREDICTED_PRICE);
  const [deadline, setDeadline] = useState(INITIAL_DATE);
  const [invalid, setInvalid] = useState(true);
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

  const handleAddMarket = () => {
    const contract = new library.eth.Contract(Prediction.abi as AbiItem[]);
    const unixDeadline = Math.floor(new Date(deadline).getTime() / MS_TO_SECS);
    contract
      .deploy({
        data: Prediction.bytecode,
        arguments: [market, predictedPrice * FLOAT_TO_SOL_NUM, unixDeadline],
      })
      .send({ from: account })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((newContractInstance: any) => {
        insertContractAddress(newContractInstance.options.address);
      });
  };

  return (
    <div className={classes.root}>
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
        error={predictedPrice < MIN_PREDICTED_PRICE}
        variant="outlined"
        helperText="Range $0 - $X"
        InputProps={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent: NumberFormatCustom as any,
        }}
      />

      <form className={classes.container}>
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
            invalidDate(deadline) ? "Select a date after the current date" : ""
          }
        />
      </form>

      <Button
        variant="contained"
        color="inherit"
        className={classes.button}
        disabled={invalid}
        startIcon={<PublishIcon />}
        onClick={() => handleAddMarket()}>
        Submit
      </Button>
    </div>
  );
}

export default AddMarket;
