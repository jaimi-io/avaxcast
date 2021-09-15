/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, GridSize, Typography } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import { ElementType } from "react";

interface TextT {
  component: ElementType<any>;
  variant: Variant;
  text: string;
}

// Constants used for grid size
export const FULL_WIDTH = 12;
export const PRICES_WIDTH = 6;
export const TITLE_WIDTH = 6;
export const VOTES_WIDTH = 4;
export const INFO_WIDTH = 2;
export const SHARES_WIDTH = 1;

/**
 * Helper function to generate a text object of type {@link TextT}
 * @param component - Component passed to Typography (e.g. 'h1')
 * @param variant - Variant passed to Typography (e.g. 'body1')
 * @param text - The string to display
 * @returns Text Object of type {@link TextT}
 */
export const makeTextObj = (
  component: ElementType<any>,
  variant: Variant,
  text: string
): TextT => {
  return {
    component: component,
    variant: variant,
    text: text,
  };
};

/**
 * Generates a grid with one set of typography
 * @param gridSize - The size of MaterialUI grid
 * @param text - The text object, passed to Typography as props
 * @returns UI for a Grid with text within
 */
export const singleText = (gridSize: GridSize, text: TextT): JSX.Element => {
  return (
    <Grid item xs={gridSize}>
      <Typography component={text.component} variant={text.variant}>
        {text.text}
      </Typography>
    </Grid>
  );
};

/**
 * Generates a grid with two sets of typography
 * @param gridSize - The size of MaterialUI grid
 * @param text1 - The first text object {@link TextT}, passed to Typography as props
 * @param text2 - The second text object {@link TextT}, passed to Typography as props
 * @returns UI for a Grid with two sets of text within
 */
export const doubleText = (
  gridSize: GridSize,
  text1: TextT,
  text2: TextT
): JSX.Element => {
  return (
    <Grid item xs={gridSize}>
      <Typography component={text1.component} variant={text1.variant}>
        {text1.text}
      </Typography>
      <Typography component={text2.component} variant={text2.variant}>
        {text2.text}
      </Typography>
    </Grid>
  );
};
