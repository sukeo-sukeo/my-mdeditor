export const getDate = (date, deli, timeDeli) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const H = date.getHours();
  const M = date.getMinutes();
  const S = date.getSeconds();

  return y + deli + m + deli + d + " " + H + timeDeli + M;
};
