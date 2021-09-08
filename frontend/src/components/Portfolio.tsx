import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { useWeb3React } from "@web3-react/core";
import { getHoldings, MarketRecord } from "common/contract";
import { marketNames } from "common/markets";
import { getContractAddresses } from "common/skyDb";
import { handleSnackbarClose } from "common/Snackbar";
import { Fragment, useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { fromWei } from "web3-utils";
import Fallback from "./Fallback";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row({ row }: { row: MarketRecord }) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  return (
    <Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {marketNames[row.market]}
        </TableCell>
        <TableCell align="right">{row.yesVotes}</TableCell>
        <TableCell align="right">{row.noVotes}</TableCell>
        <TableCell align="right">{fromWei(row.totalMoney)}</TableCell>
        <TableCell align="right">{row.deadline}</TableCell>
        <TableCell align="right">
          <LinkContainer to={`/market/${row.address}`}>
            <Button variant="contained" color="default">
              VISIT
            </Button>
          </LinkContainer>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Block Number</TableCell>
                    <TableCell>Transaction Hash</TableCell>
                    <TableCell align="right">Vote</TableCell>
                    <TableCell align="right">Investment (AVAX)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.transactionHash}</TableCell>
                      <TableCell align="right">{`${historyRow.vote}`}</TableCell>
                      <TableCell align="right">
                        {fromWei(historyRow.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

function Portfolio(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(true);
  const [records, setRecords] = useState<MarketRecord[]>([]);
  const web3 = useWeb3React();

  const handleLoadingClose = () => {
    setLoading(false);
  };

  const fetchRecords = async () => {
    if (!web3.active) {
      return;
    }
    setOpenSnackbar(false);
    setLoading(true);
    const allAddresses = await getContractAddresses();
    const marketRecords = await getHoldings(allAddresses, web3);
    setRecords(marketRecords);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [web3.active]);

  if (records.length === 0) {
    return (
      <Fallback
        warning={"CONNECT YOUR WALLET"}
        isSnackbarOpen={openSnackbar}
        handleSnackbarClose={handleSnackbarClose(setOpenSnackbar)}
        loading={loading}
        handleLoadingClose={handleLoadingClose}
      />
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Markets</TableCell>
            <TableCell align="right">Yes Votes</TableCell>
            <TableCell align="right">No Votes</TableCell>
            <TableCell align="right">Total (AVAX)</TableCell>
            <TableCell align="right">Deadline</TableCell>
            <TableCell align="right">Market Page</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row) => (
            <Row key={row.address} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Portfolio;
