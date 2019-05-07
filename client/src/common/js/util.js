/* eslint-disable */
import moment from 'moment';

// 如果章节类型 是  slideshow || images- 为 true 否则 为 false
export const chapterType = (data) => {
  return data.includes('scrollBanner') || data.includes('displayPicture')
};

export const iconName = (data) => {
  let name = '';
  if (data.startsWith('scrollBanner')) {
    return name = 'scrollBanner'
  }
  if (data.startsWith('displayPicture')) {
    return name = 'displayPicture'
  }
  switch (data) {
    case 'video':
      name = 'video';
      break;
    case 'categoryList':
      name = 'categoryList';
      break;
    case 'productList':
      name = 'productList';
      break;
    case 'tagList':
      name = 'tagList';
      break;
    default:
      name = ''
  }
  return name;
};

// 判断类型
export const isTypeOf = str => str.includes('scrollBanner') || str.includes('slideshow');

// 字符串中获取数字
export const getNumber = str => parseFloat(str.replace(/[^0-9]/ig, ''));

export const IMGUrl = process.env.IMG_BASE || '';

// 导出背景图片
export const _bg = (v) => {
  return v ? {
    backgroundImage: `url('${IMGUrl + v}')`,
  } : {}
};

export const IMAGE_MAX_LENGTH = 5; // 最多展示5张

// 获取路径上的ID 192.168.1.22:8080/index/****
export const getUrlId = () => {
  return window.location.pathname.replace(/^\/([^]+)?\//, '');
}

// 数组位置交换
// export const swapArray = (arr, index1, index2) => {
//   arr[index1] = arr.splice(index2, 1, arr[index1])[0];
//   return arr;
// }

function getLocalTime(i) {

  //参数i为时区值数字，比如北京为东八区则输进8,西5输入-5

  if (typeof i !== 'number') return;

  var d = new Date();

  //得到1970年一月一日到现在的秒数

  var len = d.getTime();

  //本地时间与GMT时间的时间偏移差
  var offset = d.getTimezoneOffset() * 60000;

  //得到现在的格林尼治时间

  var utcTime = len + offset;

  return new Date(utcTime + 3600000 * i);
}


// 算时间
export const get_time = (zone) => {
  // let timer = 0; // 保存当前时间的毫秒数
  // 保存服务端时区的符号 (- | +) (比如 -07:00 获取 -)
  // let serverZoneSymbol = '';
  // let clientZoneSymbol = '';
  // 获取客户端当前时间;
  const clientNow = new Date();
  // 获取偏移毫秒数; (-取反)
  const clientOffset = -(clientNow.getTimezoneOffset() * 60 * 1000);
  // 保存着服务端的跟格林威治时区的相差毫秒数; (负数是 需要加, 正数需要减)
  let serverOffset = -0;
  // 如果是格林威治时区则是 'Z'; 则设置为 0000 否则替换成':'  比如 +06:30 替换成 +0630
  if (zone === 'Z') {
    zone = '0000';
  } else {
    // zone = zone.replace(/:/,'.')
    // serverZoneSymbol = zone.match(/(\+|-){1}/)[0];
    const zone1 = zone.split(':');
    serverOffset = ((+zone1[0]) * 60 * 60 * 1000) + (zone1[1] * 60 * 1000);
    console.log(serverOffset, '服务器', +zone1[0]);
  }

  // 表示都在服务端跟客户端都在0时区;
  // if (serverOffset === clientOffset) {
  //   // 直接返回当前毫秒数;
  //   return clientNow.getTime();
  // }

  // if(clientOffset === 0) {
  //   console.log('我是000000000')
  // }

  // if (clientOffset > 0) {
  //   console.log('表示是 >> 大于 >> 格林威治时区', clientOffset)
  // } else {
  //   console.log('表示是 << 小于 << 格林威治时区', clientOffset)
  // }
  console.log(clientNow - clientOffset, '格林威治时区的毫秒数', clientOffset)

  console.log((clientNow - clientOffset) + serverOffset - (serverOffset -clientOffset), '返回服务器正常毫秒数', serverOffset)

  // console.log(zone)
  // 获取时间中的时区偏移量
  // const cuZone = currentDate.toString().match(/(\+|-)[0-9]{0,4}/)[0];
  // 如果相等则直接返回客户端的时间毫秒数
  // if (zone === cuZone) {
  //   return new Date().getTime();
  // }

  // const text1 = zone.replace(/(\+|-){1}/, '');
  // const text2 = cuZone.replace(/(\+|-){1}/, '');
  // const _symbol1 = zone[0];
  // const _symbol2 = cuZone[0];

  // 如果 符号一样 表示 都是 -- 或者 ++
  // if (_symbol1 === _symbol2) {
  //   console.log('都是加  或者 都是减');
  //   if (_symbol1 === '+') {
  //     if (text2 > text1) {
  //       console.log(text2 - text1);
  //     }
  //     console.log('加时区')
  //   } else {
  //     console.log('减时区')
  //   }
  // } else {
  //   // 这是一个加 一个减
  //   console.log('这是一个加 一个减')
  // }
  // if (_symbol1 === _symbol2) {
  //   console.log('都是加  或者 都是减')
  //   if (_symbol1 === '+') {
  //     if (_symbol1 > _symbol2) {
  //       console.log(' >>>>>> ')
  //     } else {
  //       console.log(' <<<<<< ', _symbol2, _symbol1)
  //     }
  //     console.log('++')
  //   } else {
  //     console.log('--')
  //   }
  // } else {

  // }
}

