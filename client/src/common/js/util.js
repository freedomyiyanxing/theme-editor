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
