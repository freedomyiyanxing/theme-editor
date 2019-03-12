const express = require('express');

const app = express();

// 模拟 主题 数据接口
const Theme = require('./api/theme.js');
const Switch = require('./api/switch.js');
app.use('/api/theme/:id', (req, res, next) => {
  const _home = new Theme(req, res);
  const url = req.baseUrl;
  Switch(url,_home,next);
});

app.listen(3333, () => {
  console.log('服务器挂载 在 3333 端口')
});
