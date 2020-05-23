import { flattenArrayOfArrays } from "../src/utils";

describe("flattenArrayOfArrays", () => {
  test("flattens empty array", () => {
    expect(flattenArrayOfArrays([])).toEqual([]);
  })

  test("flattens array of single elememt array", () => {
    expect(
      flattenArrayOfArrays([
        ["lastName"],
        ["firstName"],
      ])
    ).toEqual(["lastName", "firstName"]);
  });

  test("flattens array of multiple element array", () => {
    expect(
      flattenArrayOfArrays([
        ["lastName", false],
        ["firstName", false],
      ])
    ).toEqual(["lastName", false, "firstName", false]);
  });
});
