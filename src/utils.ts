export function flattenArrayOfArrays(arrayOfArrays: any[][]) {
  return arrayOfArrays.reduce((acc: any[], val: any) => acc.concat(val), []);
}
