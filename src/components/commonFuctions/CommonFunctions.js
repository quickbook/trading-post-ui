export const foreignNumberSystem = (num) => {
  let temp = String(num);
  let dec = temp.split(".")[1];
  let str = temp.split(".")[0];
  let n = str.length;

  if (n <= 3) {
    return str;
  }

  let result = [];
  let i = n % 3 == 0 ? 3 : n % 3;
  result.push(str.slice(0, i));
  str = str.slice(i);

  while (str.length > 3) {
    result.push(str.slice(0, 3));
    str = str.slice(3);
  }
  result.push(str);

  return dec ? result.join(",") + "." + dec : result.join(",");
};
