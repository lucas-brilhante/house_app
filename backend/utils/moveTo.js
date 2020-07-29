const fs = require("fs");

const moveTo = (oldPath, newPath) => {
  fs.rename(oldPath, newPath, (error) => console.log(error));
};

module.exports = moveTo;
