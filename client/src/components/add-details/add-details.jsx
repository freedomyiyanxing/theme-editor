import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';

import { TemplateData } from '../../store/index';
import SidebarHeader from '../../base/sidebar-header/sidebar-header.jsx';
import NameInput from '../../base/input/name-input.jsx';
import ListView from '../../base/list/list.jsx';
import DragList from './drag-list.jsx';
import { isTypeOf } from '../../common/js/util';

import classes from './add-details.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer export default class AddDetails extends React.Component {
  // 添加
  handleAddSection = () => {
    this.isRefresh();
    const { templateData, name } = this.props;
    const { section, componentItems } = templateData;
    const { modulesOrder } = section[name].config;
    const len = modulesOrder.length;
    /*
    * 如果有 componentItems[name]这个数组 且 数组它不等于空
    * 则说明已经操作过删除,  否则根据下标累加数据
    */
    if (componentItems[name] && componentItems[name].length) {
      const comArr = componentItems[name];
      const index = comArr[comArr.length - 1];
      const _name = `modules${index}`;
      templateData.addComponentItems(name, _name, this.addSection(name, _name, index));
      comArr.length -= 1;
    } else {
      const _name = `modules${len}`;
      templateData.addComponentItems(name, _name, this.addSection(name, _name, len));
    }
  };

  // 修改名称
  handleSetName = (value) => {
    this.isRefresh();
    const { templateData, name } = this.props;
    templateData.setChaptersName(name, value)
  };

  // 添加 section
  addSection(name, _name, index) {
    const text = name.includes('scrollBanner') ? 'Banner - ' : 'Picture - ';
    return {
      [_name]: {
        config: {
          title: text + (index + 1),
          url: null,
          isShow: true,
          effDate: null,
          expDate: null,
          imgPath: null,
        },
      },
    };
  }

  // 做了操作时 启动禁止刷新 跟 删除
  isRefresh() {
    if (window.__IS__START__REFRESH__) {
      window.__stopRefresh__();
    }
  }

  render() {
    const {
      templateData, backClick, name, click,
    } = this.props;
    const { section } = templateData;
    const { config } = section[name];
    let text1;
    let text2;
    if (isTypeOf(name)) {
      text1 = 'Scroll banner';
      text2 = 'Banner';
    } else {
      text1 = 'Display picture';
      text2 = 'Picture';
    }
    return [
      <SidebarHeader key="add-details-top" click={() => { backClick('home') }}>
        {text1}
      </SidebarHeader>,
      <section key="add-details-bottom" className={classes.container}>
        <div className={classes.content}>
          <div className={classes.title}>
            <NameInput click={this.handleSetName} defaultVal={config.title} />
          </div>
          <div ref={n => this.wrapper = n}>
            <DragList name={name} click={click} refresh={this.isRefresh} />
          </div>
          <div className={classes.handle}>
            <ListView click={this.handleAddSection}>
              <span className={`icon-add ${classes.icon}`} />
              <span className={classes.text}>Add {text2}</span>
            </ListView>
          </div>
        </div>
      </section>,
    ]
  }
}

AddDetails.wrappedComponent.propTypes = {
  name: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
  backClick: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
