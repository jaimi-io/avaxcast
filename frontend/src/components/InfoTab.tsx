import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

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
  const [value, setValue] = React.useState(0);

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
        <Tab label="Add Market" {...a11yProps(0)} />
        <Tab label="Vote on a Prediction" {...a11yProps(1)} />
        <Tab label="Withdraw Winnings" {...a11yProps(2)} />
        <Tab label="View Holdings" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}></TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
    </div>
  );
}
export default InfoTab;
