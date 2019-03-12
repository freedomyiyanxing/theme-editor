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
export const isTypeOf = (str) => {
  return str.includes('scrollBanner') || str.includes('slideshow')
};

// 数组去重
export const resultArr = (arr) => {
  return Array.from(new Set(arr))
};

// 数组排序
// export const sortArr = (arr) => {
//   if (!arr.length) return arr;
//   return resultArr(arr).sort((a, b) => {
//     return a - b
//   })
// };

// 字符串中获取数字
export const getNumber = str => parseFloat(str.replace(/[^0-9]/ig, ''));
