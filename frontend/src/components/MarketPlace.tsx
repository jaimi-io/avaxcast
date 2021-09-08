import { ListItemAvatar, ListItemText } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { filterMarketActions } from "actions";
import { ContractI, getAllContractInfo } from "common/contract";
import { getCurrentDateString, monthAfter } from "common/date";
import { marketIcons, marketNames } from "common/markets";
import { getContractAddresses } from "common/skyDb";
import Posts from "components/Posts";
import { useAppDispatch, useAppSelector } from "hooks";
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filters: {
      display: "flex",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    form: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    button: {
      minHeight: 55,
    },
    textField: {
      width: 200,
    },
  })
);

interface MarketDialogProps {
  open: boolean;
  onClose: () => void;
}

function MarketDialog({ onClose, open }: MarketDialogProps): JSX.Element {
  const dispatch = useAppDispatch();

  const handleClose = (num: number) => {
    dispatch(filterMarketActions[num]());
    onClose();
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Select Market</DialogTitle>
      <List>
        {marketIcons.map((icon, index) => (
          <ListItem
            key={index}
            button
            onClick={() => {
              handleClose(index);
            }}>
            <ListItemAvatar>
              <img src={icon} width={"50px"} />
            </ListItemAvatar>
            <ListItemText primary={marketNames[index]} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

function MarketPlace(): JSX.Element {
  const classes = useStyles();
  const marketFilter = useAppSelector((state) => state.marketFilter);
  const icon = marketIcons[marketFilter];
  const DEFAULT_DATE = getCurrentDateString();
  const DEFAULT_END_DATE = monthAfter(DEFAULT_DATE);
  const [startDate, setStartDate] = useState(DEFAULT_DATE);
  const [endDate, setEndDate] = useState(DEFAULT_END_DATE);
  const [openDialog, setOpenDialog] = useState(false);
  const [contracts, setContracts] = useState<ContractI[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const adds = await getContractAddresses();
      setContracts(await getAllContractInfo(adds));
      setLoading(false);
    };
    fetch();
  }, []);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleLoadingClose = () => {
    setLoading(false);
  };

  return (
    <div>
      <div className={classes.filters}>
        <FormControl className={classes.formControl}>
          <Button
            variant="outlined"
            className={classes.button}
            onClick={handleDialogOpen}
            startIcon={<img src={icon} width={"20px"} />}>
            Select Market
          </Button>
          <MarketDialog open={openDialog} onClose={handleDialogClose} />
        </FormControl>

        <form className={classes.form} noValidate>
          <TextField
            id="date"
            label="Start Deadline"
            variant="outlined"
            type="date"
            onChange={(e) => setStartDate(e.target.value)}
            defaultValue={DEFAULT_DATE}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </form>
        <form className={classes.form} noValidate>
          <TextField
            id="date"
            label="End Deadline"
            variant="outlined"
            type="date"
            onChange={(e) => setEndDate(e.target.value)}
            defaultValue={DEFAULT_END_DATE}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </form>
      </div>
      <Posts
        contracts={contracts}
        deadlineFilter={[startDate, endDate]}
        loading={loading}
        handleLoadingClose={handleLoadingClose}
      />
    </div>
  );
}

export default MarketPlace;
