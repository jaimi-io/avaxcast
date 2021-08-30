import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PublishIcon from "@material-ui/icons/Publish";
import { useEffect, useState } from "react";
import { getDate } from "common/date";
import Prediction from "contracts/PredictionMarket.json";
import { AbiItem } from "web3-utils";
import { useWeb3React } from "@web3-react/core";
import { menuMarkets } from "../common/markets";

const MIN_PREDICTED_PRICE = 0;

function validMarket(market: string): boolean {
  return market !== "All Markets";
}

function validPrice(price: number): boolean {
  return price >= MIN_PREDICTED_PRICE;
}

function validDate(date: string): boolean {
  const now = new Date();
  const selectedDate = new Date(date);
  return now < selectedDate;
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

function AddMarket(): JSX.Element {
  const classes = useStyles();
  const INITIAL_PREDICTED_PRICE = 0;
  const INITIAL_DATE = getDate();
  // state
  const [market, setMarket] = useState("All Markets");
  const [predictedPrice, setPredictedPrice] = useState(INITIAL_PREDICTED_PRICE);
  const [deadline, setDeadline] = useState(INITIAL_DATE);
  const [invalid, setInvalid] = useState(true);
  const { active, account, library } = useWeb3React();

  useEffect(() => {
    setInvalid(
      () =>
        !validMarket(market) ||
        !validPrice(predictedPrice) ||
        !validDate(deadline) ||
        !active
    );
  }, [market, predictedPrice, deadline, active]);

  const handleAddMarket = () => {
    const contract = new library.eth.Contract(Prediction.abi as AbiItem[]);
    const tenSecDelay = Math.floor(Date.now() / 1000) + 10;

    const market = contract
      .deploy({ data: Prediction.bytecode, arguments: [0, 10, tenSecDelay] })
      .send({ from: account });
    console.log(market);
  };

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <Select
          defaultValue="All Markets"
          labelId="markets-select"
          id="markets-select"
          type="text"
          error={!validMarket(market)}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange={(e) => setMarket(e.target.value)}>
          <MenuItem value={"All Markets"}>All Markets</MenuItem>
          {menuMarkets().map((market, index) => (
            <MenuItem value={market} key={index}>
              {market}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Predicted Price ($)"
        id="standard-number"
        type="number"
        defaultValue={INITIAL_PREDICTED_PRICE}
        className={classes.textField}
        onChange={(e) => setPredictedPrice(parseInt(e.target.value))}
        error={predictedPrice < MIN_PREDICTED_PRICE}
        helperText="Range $0 - $X"
      />

      <form className={classes.container}>
        <TextField
          id="date"
          label="Deadline"
          type="date"
          defaultValue={INITIAL_DATE}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setDeadline(e.target.value)}
          error={!validDate(deadline)}
          helperText={
            validDate(deadline) ? "" : "Select a date after the current date"
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
