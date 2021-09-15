import {
  Grid,
  makeStyles,
  createStyles,
  Typography,
  Theme,
  Button,
} from "@material-ui/core";
import { AttachMoney } from "@material-ui/icons";
import { useWeb3React } from "@web3-react/core";
import { isLoading, notLoading } from "actions";
import { ContractI, withdraw } from "common/contract";
import { voteString } from "common/markets";
import { handleSnackbarClose } from "common/Snackbar";
import { useAppDispatch } from "hooks";
import { Dispatch, SetStateAction } from "react";
import { fromWei } from "web3-utils";
import Loading from "./Loading";
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
            <Typography component="p">{winningShares}</Typography>
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

export default WithdrawShares;
