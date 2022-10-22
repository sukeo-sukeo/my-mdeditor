export const makeTableHeads = (keys, responsive, responsiveViewKeys="") => {
  if (responsive) {
    keys = keys.filter((_, idx) => responsiveViewKeys.includes(idx));
  }
  return keys;
}