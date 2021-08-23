import { render, screen } from "@testing-library/react";
import Home from "components/Home";

test("renders learn react link", () => {
  render(<Home />);
  const linkElement = screen.getByText(/Vote/i);
  expect(linkElement).toBeInTheDocument();
});
