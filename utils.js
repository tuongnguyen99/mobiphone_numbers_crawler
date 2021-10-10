function insertDecimal(num) {
  return num.slice(0, 4) + '.' + num.slice(4, 7) + '.' + num.slice(7);
}

module.exports = { insertDecimal };
