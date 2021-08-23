import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { posts, PostsT } from "dummy";

function Post({ title, info, image }: PostsT): JSX.Element {
  return (
    <Grid item>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Coin"
            height="140"
            image={image}
            title="Coin"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography component="p">{info}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="medium" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default function Posts(): JSX.Element {
  return (
    <div style={{ marginTop: 20, padding: 50 }}>
      <Grid container justify="center">
        {posts.map((post) => (
          <Post
            key={post.title}
            title={post.title}
            info={post.info}
            image={post.image}
          />
        ))}
      </Grid>
    </div>
  );
}
