import { Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import { Market } from "common/enums";
import { marketIcons, marketNames } from "common/markets";
import { useAppDispatch, useAppSelector } from "hooks";
import { ContractI } from "common/contract";
import { LinkContainer } from "react-router-bootstrap";
import { fromWei } from "web3-utils";
import Fallback from "./Fallback";
import { notLoading } from "actions";

/**
 * Post for a Market
 * @param props - {@link ContractI}
 * @returns The Post Component
 */
function Post({
  address,
  market,
  predictedPrice,
  date,
  volume,
  yesPrice,
  noPrice,
}: ContractI): JSX.Element {
  const formattedDate = date.toDateString();
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
                  <Typography component="p">{formattedDate}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" component="p">
                {`Will ${marketNames[market]} reach ${predictedPrice} by ${formattedDate}`}
              </Typography>
              <Grid container>
                <Grid item xs>
                  <Typography variant="body2" component="p">
                    {"Total Volume:"}
                  </Typography>
                  <Typography component="p">{`${fromWei(
                    volume
                  )} AVAX`}</Typography>
                </Grid>
                <Grid item xs>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        component="p"
                        align="right">{`Yes: ${fromWei(yesPrice)}`}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        component="p"
                        align="right">{`No: ${fromWei(noPrice)}`}</Typography>
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
  deadlineFilter: string[];
}

/**
 * A collection of all posts for the markets
 * @param props - {@link PropsT}
 * @returns The Posts Component
 */
function Posts({ contracts, deadlineFilter }: PropsT): JSX.Element {
  const marketFilter = useAppSelector((state) => state.marketFilter);
  const dispatch = useAppDispatch();
  const [start, end] = deadlineFilter;
  const startDate = new Date(start);
  const endDate = new Date(end);

  const filterPost = (post: ContractI): boolean => {
    const withinDates = startDate <= post.date && post.date <= endDate;
    if (marketFilter === Market.ALL) {
      return withinDates;
    }
    return post.market === marketFilter && withinDates;
  };

  const filtered = contracts.filter(filterPost);

  if (filtered.length === 0) {
    return (
      <Fallback
        warning={""}
        isSnackbarOpen={false}
        handleLoadingClose={() => dispatch(notLoading())}
      />
    );
  }

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
