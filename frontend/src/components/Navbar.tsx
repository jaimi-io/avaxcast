import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import {
  Book,
  AccountBalanceWallet,
  AttachMoney,
  HowToVote,
} from "@material-ui/icons";

export default function Navbar(): JSX.Element {
  return (
    <div>
      <List component="nav">
        <ListItem component="div">
          <ListItemText inset>
            <Typography color="inherit">
              Vote
              <HowToVote />
            </Typography>
          </ListItemText>

          <ListItemText inset>
            <Typography color="inherit">
              Portfolio <Book />
            </Typography>
          </ListItemText>

          <ListItemText inset>
            <Typography color="inherit">
              Buy <AttachMoney />
            </Typography>
          </ListItemText>

          <ListItemText inset>
            <Typography color="inherit">
              Wallet <AccountBalanceWallet />
            </Typography>
          </ListItemText>
        </ListItem>
      </List>
    </div>
  );
}
