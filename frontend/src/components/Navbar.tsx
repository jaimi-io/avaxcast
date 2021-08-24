import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { Book, AccountBalanceWallet, HowToVote } from "@material-ui/icons";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";

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
              Add <LibraryAddIcon />
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
