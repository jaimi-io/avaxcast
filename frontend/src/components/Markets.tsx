import Button from "@material-ui/core/Button";
import Posts from "components/Posts";

export default function Markets(): JSX.Element {
  return (
    <div>
      <Button color="primary">All Markets</Button>
      <Button color="primary">Total Volume</Button>
      <Button color="primary">Open</Button>
      <Button color="primary">All Currencies</Button>
      <Posts />
    </div>
  );
}
