import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
} from 'mobx-react';
import { TemplateData } from '../../store/index';
import ListView from '../../base/list/list.jsx';
import List from './list.jsx';
import SidebarHeader from '../../base/sidebar-header/sidebar-header.jsx';

import { tabText } from '../../static/default-template-data';

import classes from './sidebar-list.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class ListBar extends React.Component {
  componentDidMount() {
    // const { templateData } = this.props;
    // let index;
    // let layer_y;
    // let is;
    // new Sortable(this.wrapper, {
    //   handle: '.icon-drag',
    //   onStart: (evt) => {
    //     this.isRefresh();
    //     index = evt.oldIndex;
    //     layer_y = 0;
    //     templateData.handleDropScroll('start', evt.oldIndex);
    //     is = true;
    //   },
    //   onChange: (evt) => {
    //     const { oldIndex, newIndex, originalEvent } = evt;
    //     // console.log(index, newIndex, oldIndex);
    //     templateData.handleDropScroll('int', index, index, newIndex);
    //     console.log('index :', index, '   oldIndex :', oldIndex, '    newIndex :', newIndex)
    //     // 判断向上 或者向下拖动...
    //     // 判断条件： 如果 上一次y 大于 当前y 则是向上拖动 或 第一次拖动时 当前下标 大于 目标下标 则也是向上拖动
    //     if (layer_y > originalEvent.layerY || (is && oldIndex > newIndex)) {
    //       index -= 1;
    //       // console.log('向上', originalEvent.y, is)
    //     } else {
    //       index += 1;
    //       // console.log('向下', originalEvent.y)
    //     }
    //     layer_y = originalEvent.layerY;
    //     is = false;
    //   },
    //   onEnd: (evt) => {
    //     templateData.handleDropScroll('end', evt.newIndex)
    //   },
    // });
  }

  handleClick = (i) => {
    this.lineClamp.style.transform = `translate3d(${i === 0 ? 0 : 175}px, 0px, 0px)`
  };

  // 添加板块功能
  handleAddSection = () => {
    this.isRefresh();
    const { handleAdd } = this.props;
    handleAdd();
  };

  // 做了操作时 启动禁止刷新 跟 删除
  isRefresh() {
    // if (window.__IS__START__REFRESH__) window.__stopRefresh__();
  }

  render() {
    const { templateData, handleEdit } = this.props;
    const { section } = templateData;
    // console.log(' -------- 00000   ----- 拖动呀 ...')
    return [
      <SidebarHeader key={uuid()} isReturn>
        {tabText.map((v, i) => (
          <span
            tabIndex={i}
            role="button"
            key={v}
            className={classes.link}
            // onClick={() => { this.handleClick(i) }}
          >
            {v}
          </span>
        ))}
        <span className={classes.lineClamp} ref={n => this.lineClamp = n} />
      </SidebarHeader>,
      <section key={uuid()} className={classes.container}>
        <div className={classes.content}>
          <div>
            <ListView>
              <span className={`icon-header ${classes.icon}`} />
              <span className={classes.text}>Header</span>
            </ListView>
          </div>
          <div className={classes.wrapper}>
            <List handleEdit={handleEdit} isRefresh={this.isRefresh} />
          </div>
          <div className={classes.addHandle}>
            <ListView click={this.handleAddSection}>
              <span className={`icon-add ${classes.icon}`} />
              <span className={classes.text}>Add Section</span>
            </ListView>
          </div>
          <div className={classes.footer}>
            <ListView>
              <span className={`icon-footer ${classes.icon}`} />
              <span className={classes.text}>Footer</span>
            </ListView>
          </div>
        </div>
      </section>,
    ]
  }
}

ListBar.wrappedComponent.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default ListBar
