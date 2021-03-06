import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import {
  inject,
  observer,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';
import { _bg, IMAGE_MAX_LENGTH } from '../../../common/js/util';
import classes from './banner.less'

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

const html = (obj, isMobile) => {
  return (
    obj.length
      ? (
        obj.map(v => (
          <div key={`__id${v.imgPath}`}>
            <span
              className={`${classes.items} ${isMobile ? classes.phoneItem : ''}`}
              style={_bg(v.imgPath)}
            >
              {
                v.imgPath
                  ? <span style={{ height: 50 }} />
                  : <span className={`icon-default-logo ${isMobile ? classes.phoneIcon : classes.icon}`} />
              }
              <span className={classes.text}>
                <span>{v.title}</span>
                <span>1370 * 620</span>
              </span>
            </span>
          </div>
        ))
      )
      : null
  )
}

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class Banner extends React.Component {
  componentDidMount() {
    const { templateData, index } = this.props;
    // 如果是添加或显示 则会重新调用此组件
    templateData.eleHeight.splice(index, 0, this.wrapper.clientHeight)
  }

  conputer(config) {
    const { modulesOrder, modules } = config;
    let len = 0;
    for (let i = 0; i < modules.length; i += 1) {
      if (modules[i][modulesOrder[i]].config.isShow) {
        len = i;
      }
    }
    return len;
  }

  render() {
    const { name, templateData } = this.props;
    const { section } = templateData;
    const { config } = section[name];
    const isMobile = templateData.type === 'Phone';
    this.conputer(config);
    return (
      <div
        ref={n => this.wrapper = n}
        className={isMobile ? classes.phone : classes.container}
      >
        {
          this.conputer(config)
            ? (
              <Carousel autoplay effect="fade">
                {
                  html(filterData(config), isMobile)
                }
              </Carousel>
            )
            : html(filterData(config), isMobile)
        }
      </div>
    )
  }
}

Banner.wrappedComponent.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default Banner
