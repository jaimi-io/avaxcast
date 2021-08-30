import { Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import AvaxLogo from "images/avalanche-avax-logo.svg";
import BtcLogo from "images/bitcoin.svg";
import EthLogo from "images/ethereum.svg";
import LinkLogo from "images/link.svg";

import { posts, PostsT } from "dummy";
import { marketToString } from "common/markets";

function Post({
  market,
  predictedPrice,
  date,
  volume,
  yesPrice,
  noPrice,
}: PostsT): JSX.Element {
  const icons = [AvaxLogo, BtcLogo, EthLogo, LinkLogo];

  return (
    <Grid item>
      <Card>
        <CardActionArea>
          <CardContent>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs>
                <img src={icons[market]} width={"50px"} />
              </Grid>
              <Grid item xs>
                <Typography component="p">{predictedPrice}</Typography>
              </Grid>
              <Grid item xs>
                <Typography component="p">{date}</Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" component="p">
              {`Will ${marketToString(
                market
              )} reach ${predictedPrice} by ${date}`}
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
                      align="right">{`Yes: ${yesPrice}`}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      component="p"
                      align="right">{`No: ${noPrice}`}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default function Posts(): JSX.Element {
  return (
    <div style={{ marginTop: 20, padding: 50 }}>
      <Grid container spacing={3} justify="center">
        {posts.map((post) => (
          <Post key={post.address} {...post} />
        ))}
      </Grid>
    </div>
  );
}
