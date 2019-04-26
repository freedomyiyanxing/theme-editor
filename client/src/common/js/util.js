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

const IMGUrl = process.env.IMG_BASE || '';

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
