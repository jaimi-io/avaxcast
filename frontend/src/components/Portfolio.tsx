import { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function createData(
  name: string,
  yesVotes: number,
  noVotes: number,
  totalMoney: number,
  deadline: string,
  investment: number
) {
  return {
    name,
    yesVotes,
    noVotes,
    totalMoney,
    deadline,
    investment,
    history: [
      { date: "2020-01-05", customerId: "11091700", vote: "yes", price: 20 },
      { date: "2020-01-02", customerId: "Anonymous", vote: "no", price: 30 },
    ],
  };
}

const rows = [
  createData("Bitcon", 159, 6, 24, "2020-01-05", 3.99),
  createData("Dogecoin", 237, 9.0, 37, "2020-01-05", 4.99),
  createData("Ethereum", 262, 16.0, 24, "2020-01-05", 3.79),
  createData("Cardano", 305, 3.7, 67, "2020-01-05", 2.5),
  createData("Binance Coin", 356, 16.0, 49, "2020-01-05", 1.5),
];

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
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
          {row.name}
        </TableCell>
        <TableCell align="right">{row.yesVotes}</TableCell>
        <TableCell align="right">{row.noVotes}</TableCell>
        <TableCell align="right">{row.totalMoney}</TableCell>
        <TableCell align="right">{row.deadline}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Transcation ID</TableCell>
                    <TableCell align="right">Vote</TableCell>
                    <TableCell align="right">Investment ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.vote}</TableCell>
                      <TableCell align="right">{historyRow.price}</TableCell>
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
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Markets</TableCell>
            <TableCell align="right">Yes Votes</TableCell>
            <TableCell align="right">No Votes</TableCell>
            <TableCell align="right">Total ($)</TableCell>
            <TableCell align="right">Deadline</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Portfolio;
