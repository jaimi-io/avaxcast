import { monthAfter } from "common/date";

test("Correctly adds one month to the given date", () => {
  const date = "2021-09-01";
  expect(monthAfter(date)).toBe("2021-10-01");
});
