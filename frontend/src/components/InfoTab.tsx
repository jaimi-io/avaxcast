import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    height: 500,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  indicator: {
    backgroundColor: "#ae68fe",
  },
}));

function InfoTab(): JSX.Element {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const walkthroughs = [
    "Add Market",
    "Vote on a Prediction",
    "Withdraw Winnings",
    "View Holdings",
  ];

  const handleChange = (
    _event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        classes={{
          indicator: classes.indicator,
        }}
        className={classes.tabs}>
        {walkthroughs.map((str, index) => (
          <Tab key={index} label={str} {...a11yProps(index)} />
        ))}
      </Tabs>
      {walkthroughs.map((str, index) => (
        <TabPanel key={index} value={value} index={index}>
          {str}
        </TabPanel>
      ))}
    </div>
  );
}
export default InfoTab;