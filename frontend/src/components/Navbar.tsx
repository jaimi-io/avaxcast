import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import BookIcon from "@material-ui/icons/Book";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";

export default function Navbar(): JSX.Element {
  return (
    <div>
      <List component="nav">
        <ListItem component="div">
          <ListItemText inset>
            <Typography color="inherit">
              Vote
              <HowToVoteIcon />
            </Typography>
          </ListItemText>

          <ListItemText inset>
            <Typography color="inherit">
              Portfolio <BookIcon />
            </Typography>
          </ListItemText>

          <ListItemText inset>
            <Typography color="inherit">
              Add <LibraryAddIcon />
            </Typography>
          </ListItemText>

          <ListItemText inset>
            <Typography color="inherit">
              Wallet <AccountBalanceWalletIcon />
            </Typography>
          </ListItemText>
        </ListItem>
      </List>
    </div>
  );
}
