module.exports = function (url, _shop, next) {
  switch (url) {
    case '/api/theme/index' :
      _shop.index();
      break;
    default:
      next()
  }
};
