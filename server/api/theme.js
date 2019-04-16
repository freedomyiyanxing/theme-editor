// const path = require('path');
// const fs = require('fs');
const data = require('../../z-data/data');
class Theme {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
  index() {
    filename('theme', this.res)
  }
}

const filename = (file, res) => {
  res.json(data)
};

module.exports = Theme;
