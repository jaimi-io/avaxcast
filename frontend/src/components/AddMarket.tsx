import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PublishIcon from "@material-ui/icons/Publish";

// name of coin
// deadline date
// predicted price

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

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <Select
          defaultValue="All Markets"
          labelId="markets-select"
          id="markets-select">
          <MenuItem value={"All Markets"}>All Markets</MenuItem>
          <MenuItem value={"AVAX/USD"}>AVAX/USD</MenuItem>
          <MenuItem value={"BTC/USD"}> BTC/USD</MenuItem>
          <MenuItem value={"ETH/USD"}>ETH/USD</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Predicted Price ($)"
        id="margin-none"
        defaultValue={0}
        className={classes.textField}
        helperText="Range $0 - $X"
      />
      <form className={classes.container} noValidate>
        <TextField
          id="date"
          label="Deadline"
          type="date"
          defaultValue="2021-08-24"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>

      <Button
        variant="contained"
        color="inherit"
        className={classes.button}
        startIcon={<PublishIcon />}>
        Submit
      </Button>
    </div>
  );
}

export default AddMarket;
