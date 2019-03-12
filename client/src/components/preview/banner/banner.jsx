import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import {
  inject,
  observer,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';
import classes from './banner.less'

const MAX_LENGTH = 5; // 最多展示5张
const IMGUrl = process.env.IMG_BASE || '';

// 导出背景图片
const _bg = (v) => {
  return v ? {
    backgroundImage: `url('${IMGUrl + v}')`,
  } : {}
};

const filterData = (config) => {
  const img = config.modules;
  const mod = config.modulesOrder;
  const arr = [];
  let j = 0;
  // 先遍历所有数据, 踢掉(隐藏 , 过期)的数据
  for (let i = 0; i < mod.length; i += 1) {
    const {
      title, imgPath, isShow, effDate, expDate,
    } = img[i][mod[i]].config;
    const dataTime = new Date().getTime();
    if (effDate && expDate) {
      // 设置 -> 开始时间得 < 当前渲染时间 且 结束时间得 > 当前渲染时间
      const isOverdue = effDate < dataTime && expDate > dataTime;
      if (isShow && isOverdue && j < MAX_LENGTH) {
        j += 1;
        arr.push({
          title,
          imgPath,
        })
      }
    } else {
      if (isShow && j < MAX_LENGTH) { // eslint-disable-line
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

const html = (obj, isMobile) => (
  obj.length
    ? (
      obj.map(v => (
        <div key={`__id${v.imgPath}`}>
          <span
            className={`${classes.items} ${isMobile ? classes.phoneItem : ''}`}
            style={_bg(v.imgPath)}
          >
            <span className={`icon-default-logo ${isMobile ? classes.phoneIcon : classes.icon}`} />
            <span>
              {v.title}
            </span>
          </span>
        </div>
      ))
    )
    : null
);

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class Banner extends React.Component {
  render() {
    const { name, templateData } = this.props;
    const { section } = templateData;
    const { config } = section[name];
    const isMobile = templateData.type === 'Phone';
    // console.log(' 图片 轮播 卡卡卡卡 呀 ----- ');
    return (
      <div className={isMobile ? classes.phone : classes.container}>
        <Carousel autoplay effect="fade">
          {
            html(filterData(config), isMobile)
          }
        </Carousel>
      </div>
    )
  }
}

Banner.wrappedComponent.propTypes = {
  name: PropTypes.string.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default Banner
