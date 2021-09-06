import { Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Market from "common/enums";
import { marketIcons, marketNames } from "common/markets";
import { useAppSelector } from "hooks";
import { ContractI } from "common/contract";
import { LinkContainer } from "react-router-bootstrap";
import { fromWei } from "web3-utils";

function Post({
  address,
  market,
  predictedPrice,
  date,
  volume,
  yesPrice,
  noPrice,
}: ContractI): JSX.Element {
  return (
    <LinkContainer to={`/market/${address}`}>
      <Grid item>
        <Card>
          <CardActionArea>
            <CardContent>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs>
                  <img src={marketIcons[market]} width={"50px"} />
                </Grid>
                <Grid item xs>
                  <Typography component="p">{predictedPrice}</Typography>
                </Grid>
                <Grid item xs>
                  <Typography component="p">{date}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" component="p">
                {`Will ${marketNames[market]} reach ${predictedPrice} by ${date}`}
              </Typography>
              <Grid container>
                <Grid item xs>
                  <Typography variant="body2" component="p">
                    {"Total Volume:"}
                  </Typography>
                  <Typography component="p">{volume}</Typography>
                </Grid>
                <Grid item xs>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        component="p"
                        align="right">{`Yes: ${fromWei(
                        yesPrice,
                        "ether"
                      )}`}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        component="p"
                        align="right">{`No: ${fromWei(
                        noPrice,
                        "ether"
                      )}`}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </LinkContainer>
  );
}

interface PropsT {
  contracts: ContractI[];
}

function Posts({ contracts }: PropsT): JSX.Element {
  const marketFilter = useAppSelector((state) => state.marketFilter);

  const filterPost = (post: ContractI) => {
    if (marketFilter === Market.ALL) {
      return true;
    }
    return post.market === marketFilter;
  };

  const filtered = contracts.filter(filterPost);

  return (
    <div style={{ marginTop: 20, padding: 50 }}>
      <Grid container spacing={3} justifyContent="center">
        {filtered.map((post) => (
          <Post key={post.address} {...post} />
        ))}
      </Grid>
    </div>
  );
}

export default Posts;
