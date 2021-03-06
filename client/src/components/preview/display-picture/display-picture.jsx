import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
  observer,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';
import { _bg, IMAGE_MAX_LENGTH } from '../../../common/js/util';

import classes from './display-picture.less';

const sizeObj = {
  images_1: ['1370 * 620', '685 * 620', '465 * 620', '342 * 620', '274 * 620'],
  images_234: {
    max: '685* 620',
    min: ['342 * 310', '342 * 310'],
  },
  images_5: {
    max: '1370 * 382',
    min: ['1370 * 238', '685 * 238', '456 * 238', '342 * 238'],
  },
}


// 先遍历所有数据, 踢掉(隐藏 , 过期)的数据
const createSuccessData = (config) => {
  const img = config.modules;
  const mod = config.modulesOrder;
  const arr = [];
  let j = 0;
  // 先遍历所有数据, 踢掉(隐藏 , 过期)的数据
  for (let i = 0; i < mod.length; i += 1) {
    const {
      title, imgPath, isShow, effDate, expDate,
    } = img[i][mod[i]].config;
    // const len = type === 'images-1' ? IMAGE_1_MAX_LENGTH : IMAGE_2_MAX_LENGTH;
    const dataTime = new Date().getTime();
    if (effDate && expDate) {
      // 设置 -> 开始时间得 < 当前渲染时间 且 结束时间得 > 当前渲染时间
      const isOverdue = effDate < dataTime && expDate > dataTime;
      if (isShow && isOverdue && j < IMAGE_MAX_LENGTH) {
        j += 1;
        arr.push({
          title,
          imgPath,
        })
      }
    } else {
      if (isShow && j < IMAGE_MAX_LENGTH) { // eslint-disable-line
        j += 1;
        arr.push({
          title,
          imgPath,
        })
      }
    }
  }
  return arr;
};

// 判断是否添加class
const _cls = (index, bool, len, i) => {
  return index && !bool && len - 1 !== i ? `picture-items-children-${index}` : '';
}
/**
 * 生成 一个 span 套多个子元素的 html
 * @param obj
 * @param type
 * @param isMobile
 * @param index  当前style的标识
 * @param {*} sizeArr
 */
const publicCreateHtml = (obj, type, isMobile, index, sizeArr) => {
  // 判断数组中的每一项是否都有图片
  const isArrImg = obj.every(v => v.imgPath);
  // 只有是style2 || style4 才会进此判断
  const cls24 = (index === 2 && !isArrImg) ? `picture-list-${index}` : '';
  return (
    obj.length
      ? (
        <span className={`${classes[type]} ${cls24} ${isMobile ? classes.phoneWrapper : ''}`}>
          {
            obj.map((v, i) => {
              const arg = (index === 1 || index === 5) ? v.imgPath : isArrImg
              return (
                <span className={`${classes.item} ${_cls(index, arg, obj.length, i)}`} key={uuid()} style={_bg(v.imgPath)}>
                  {
                    v.imgPath
                      ? <span style={{ height: 50 }} />
                      : <span className={`icon-default-logo ${isMobile ? classes.phoneIcon : classes.icon}`} />
                  }
                  <span className={classes.sizeWrapper}>
                    <span>{v.title}</span>
                    <span>{sizeArr[obj.length - 1]}</span>
                  </span>
                </span>
              )
            })
          }
        </span>
      )
      : null
  );
}

/**
 * 生成 一个span 套 一个子元素的 html
 * @param obj 数据
 * @param isMobile
 * @param index 当前是那个style
 */
const single = (obj, isMobile, index, size) => {
  const cls = index && !obj.imgPath ? `picture-items-${index}` : '';
  return (
    <span key={uuid()} className={`${classes.item} ${cls}`} style={_bg(obj.imgPath)}>
      {
        obj.imgPath
          ? <span key={uuid()} />
          : [
            <span key={uuid()} className={`icon-default-logo ${isMobile ? classes.phoneIcon : classes.icon}`} />,
            <span key={uuid()} className={classes.sizeWrapper}>
              <span>{obj.title}</span>
              <span>{size}</span>
            </span>,
          ]
      }
    </span>
  )
};

// 生成img-2 数据结构
const _img2 = (config, resp = {}) => {
  resp.config = {
    max: '',
    center: [],
    min: [],
  };
  // 拿到正常显示的数据,
  const arr = createSuccessData(config);

  for (let i = 0; i < arr.length; i += 1) {
    const { title, imgPath } = arr[i];
    if (i === 0) {
      resp.config.max = {
        imgPath,
        title,
      };
    }
    if (i === 1 || i === 2) {
      resp.config.center.push({
        imgPath,
        title,
      })
    }
    if (i === 3 || i === 4) {
      resp.config.min.push({
        imgPath,
        title,
      })
    }
  }

  return resp;
};

// 生成img-3 数据结构
const _img3 = (config, resp = {}) => {
  resp.config = {
    left: [],
    center: '',
    right: [],
  };
  // 拿到正常显示的数据,
  const arr = createSuccessData(config);

  for (let i = 0; i < arr.length; i += 1) {
    const { title, imgPath } = arr[i];
    if (i === 0 || i === 1) {
      resp.config.left.push({
        imgPath,
        title,
      });
    }
    if (i === 2) {
      resp.config.center = {
        imgPath,
        title,
      };
    }
    if (i === 3 || i === 4) {
      resp.config.right.push({
        imgPath,
        title,
      })
    }
  }
  return resp;
};

// 生成img-4 数据结构
const _img4 = (config, resp = {}) => {
  resp.config = {
    min: '',
    center: [],
    max: [],
  };
  // 拿到正常显示的数据,
  const arr = createSuccessData(config);

  for (let i = 0; i < arr.length; i += 1) {
    const { title, imgPath } = arr[i];
    if (i === 0 || i === 1) {
      resp.config.max.push({
        imgPath,
        title,
      });
    }
    if (i === 2 || i === 3) {
      resp.config.center.push({
        imgPath,
        title,
      })
    }
    if (i === 4) {
      resp.config.min = {
        imgPath,
        title,
      };
    }
  }
  return resp;
};

// 生成img-5 数据结构
const _img5 = (config, resp = {}) => {
  resp.config = {
    max: '',
    min: [],
  };

  // 先遍历所有数据, 踢掉(隐藏 , 过期)的数据
  const arr = createSuccessData(config);

  for (let i = 0; i < arr.length; i += 1) {
    const { title, imgPath } = arr[i];
    if (i === 0) {
      resp.config.max = {
        title,
        imgPath,
      };
    } else {
      resp.config.min.push({
        title,
        imgPath,
      })
    }
  }
  return resp;
};

/**
 * 生成 img-2 的 html结构
 * @param obj 数据
 * @param type 类型
 * @param isMobile
 */
const htmlImg2 = (obj, type, isMobile) => (
  <span className={`${classes[type]} ${isMobile ? classes.phoneWrapper : ''}`}>
    {single(obj.config.max, isMobile, 2, sizeObj.images_234.max)}
    {publicCreateHtml(obj.config.center, 'style2', isMobile, 2, sizeObj.images_234.min)}
    {publicCreateHtml(obj.config.min, 'style2', isMobile, 2, sizeObj.images_234.min)}
  </span>
);

/**
 * 生成 img-3 的 html结构
 * @param obj 数据
 * @param type 类型
 * @param isMobile
 */
const htmlImg3 = (obj, type, isMobile) => (
  <span className={`${classes[type]} ${isMobile ? classes.phoneWrapper : ''}`}>
    {publicCreateHtml(obj.config.left, 'style3', isMobile, 3, sizeObj.images_234.min)}
    {single(obj.config.center, isMobile, 3, sizeObj.images_234.max)}
    {publicCreateHtml(obj.config.right, 'style3', isMobile, 3, sizeObj.images_234.min)}
  </span>
);

/**
 * 生成 img-4 的 html结构
 * @param obj 数据
 * @param type 类型
 * @param isMobile
 */
const htmlImg4 = (obj, type, isMobile) => (
  <span className={`${classes[type]} ${isMobile ? classes.phoneWrapper : ''}`}>
    {publicCreateHtml(obj.config.max, 'style2', isMobile, 2, sizeObj.images_234.min)}
    {publicCreateHtml(obj.config.center, 'style2', isMobile, 2, sizeObj.images_234.min)}
    {single(obj.config.min, isMobile, 2, sizeObj.images_234.max)}
  </span>
);

/**
 * 生成 img-5 的 html结构
 * @param obj 数据
 * @param type 类型
 * @param isMobile
 */
const htmlImg5 = (obj, type, isMobile) => (
  <span className={`${classes[type]} ${isMobile ? classes.phoneWrapper : ''}`}>
    {single(obj.config.max, isMobile, 5, sizeObj.images_5.max)}
    {publicCreateHtml(obj.config.min, 'style5', isMobile, 5, sizeObj.images_5.min)}
  </span>
);

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class Picture extends React.Component {
  componentDidMount() {
    const { templateData, index } = this.props;
    templateData.eleHeight.splice(index, 0, this.wrapper.clientHeight)
  }

  render() {
    const { templateData, name } = this.props;
    const { section } = templateData;
    const { config, type } = section[name];
    const { modulesOrder } = config;
    const isMobile = templateData.type === 'Phone';
    return (
      <div className={`${classes.container} ${isMobile ? classes.phone : ''}`}>
        <div
          ref={n => this.wrapper = n}
          className={classes.wrapper}
        >
          {
            type === 'images_1' && modulesOrder.length
              ? publicCreateHtml(createSuccessData(config), type, isMobile, 1, sizeObj.images_1)
              : type === 'images_2' && modulesOrder.length
                ? htmlImg2(_img2(config), type, isMobile)
                : type === 'images_3' && modulesOrder.length
                  ? htmlImg3(_img3(config), type, isMobile)
                  : type === 'images_4' && modulesOrder.length
                    ? htmlImg4(_img4(config), type, isMobile)
                    : type === 'images_5' && modulesOrder.length
                      ? htmlImg5(_img5(config), type, isMobile)
                      : null
          }
        </div>
      </div>
    )
  }
}

Picture.wrappedComponent.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default Picture
