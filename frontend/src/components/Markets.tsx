import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { getDate } from "common/date";
import Posts from "components/Posts";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      // eslint-disable-next-line no-magic-numbers
      marginTop: theme.spacing(2),
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  })
);

export default function Markets(): JSX.Element {
  const classes = useStyles();

  return (
    <div>
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
      <FormControl className={classes.formControl}>
        <Select defaultValue="Open" labelId="open-select" id="open-select">
          <MenuItem value={"Open"}>Open</MenuItem>
          <MenuItem value={"Closed"}>Closed</MenuItem>
        </Select>
      </FormControl>
      <form className={classes.container} noValidate>
        <TextField
          id="date"
          label="Deadline"
          type="date"
          defaultValue={getDate()}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
      <Posts />
    </div>
  );
}
