import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
  observer,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';

import classes from './display-picture.less';

const IMGUrl = process.env.IMG_BASE || '';
// const IMAGE_1_MAX_LENGTH = 3;
// 最多展示的数目
const IMAGE_MAX_LENGTH = 5;
// 导出背景图片
const _bg = (v) => {
  return v ? {
    backgroundImage: `url('${IMGUrl + v}')`,
  } : {}
};

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

/**
 * 生成 一个 span 套多个子元素的 html
 * @param obj
 * @param type
 * @param isMobile
 */
const publicCreateHtml = (obj, type, isMobile) => (
  obj.length
    ? (
      <span className={`${classes[type]} ${isMobile ? classes.phoneWrapper : ''}`}>
        {
          obj.map(v => (
            <span className={classes.item} key={uuid()} style={_bg(v.imgPath)}>
              {
                v.imgPath
                  ? <span style={{ height: 50 }} />
                  : <span className={`icon-default-logo ${isMobile ? classes.phoneIcon : classes.icon}`} />
              }
              <span>{v.title}</span>
            </span>
          ))
        }
      </span>
    )
    : null
);

/**
 * 生成 一个span 套 一个子元素的 html
 * @param obj 数据
 * @param isMobile
 */
const single = (obj, isMobile) => (
  <span key={uuid()} className={classes.item} style={_bg(obj.imgPath)}>
    {
      obj !== ''
        ? [
          obj.imgPath
            ? <span key={uuid()} />
            : <span key={uuid()} className={`icon-default-logo ${isMobile ? classes.phoneIcon : classes.icon}`} />,
          <span key={uuid()}>{obj.title}</span>,
        ]
        : null
    }
  </span>
);

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
    {single(obj.config.max, isMobile)}
    {publicCreateHtml(obj.config.center, 'style2', isMobile)}
    {publicCreateHtml(obj.config.min, 'style2', isMobile)}
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
    {publicCreateHtml(obj.config.left, 'style3', isMobile)}
    {single(obj.config.center, isMobile)}
    {publicCreateHtml(obj.config.right, 'style3', isMobile)}
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
    {publicCreateHtml(obj.config.max, 'style2', isMobile)}
    {publicCreateHtml(obj.config.center, 'style2', isMobile)}
    {single(obj.config.min, isMobile)}
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
    {single(obj.config.max, isMobile)}
    {publicCreateHtml(obj.config.min, 'style5', isMobile)}
  </span>
);

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class Picture extends React.Component {
  render() {
    const { templateData, name } = this.props;
    const { section } = templateData;
    const { config, type } = section[name];
    const { modulesOrder } = config;
    // console.log(modulesOrder, ' --- == display-picture.jsx');
    const isMobile = templateData.type === 'Phone';
    return (
      <div className={`${classes.container} ${isMobile ? classes.phone : ''}`}>
        <div className={classes.wrapper}>
          {
            type === 'images-1' && modulesOrder.length
              ? publicCreateHtml(createSuccessData(config), type, isMobile)
              : type === 'images-2' && modulesOrder.length
                ? htmlImg2(_img2(config), type, isMobile)
                : type === 'images-3' && modulesOrder.length
                  ? htmlImg3(_img3(config), type, isMobile)
                  : type === 'images-4' && modulesOrder.length
                    ? htmlImg4(_img4(config), type, isMobile)
                    : type === 'images-5' && modulesOrder.length
                      ? htmlImg5(_img5(config), type, isMobile)
                      : null
          }
        </div>
      </div>
    )
  }
}

Picture.wrappedComponent.propTypes = {
  name: PropTypes.string.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default Picture
