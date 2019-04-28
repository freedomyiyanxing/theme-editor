import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
} from 'mobx-react';

import Section from '../../base/slidebar-section/section.jsx';
import SidebarHeader from '../../base/sidebar-header/sidebar-header.jsx';
import NameInput from '../../base/input/name-input.jsx';
import ListView from '../../base/list/list.jsx';
import DragList from './drag-list.jsx';
import { isTypeOf } from '../../common/js/util';
import { TemplateData } from '../../store/index';

import classes from './add-details.less';

const styles = {
  borderTop: 0,
  cursor: 'pointer',
}

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

export default class AddDetails extends React.Component {
  getSessionName() {
    return window.sessionStorage && window.sessionStorage.getItem('details')
  }

  // 添加(子节点)逻辑处理
  handleAddSection = () => {
    this.isRefresh();
    const { templateData, history } = this.props;
    const { section, componentItems } = templateData;
    const { modulesOrder } = section[this.name].config;
    const len = modulesOrder.length;
    const _name = `modules${uuid().slice(0, 5)}`;
    /*
    * 如果有 componentItems[name]这个数组 且 数组它不等于空
    * 则说明已经操作过删除,  否则根据下标累加数据
    */
    if (componentItems[this.name] && componentItems[this.name].length) {
      // 有删除时进入
      const comArr = componentItems[this.name];
      const index = comArr[comArr.length - 1];
      templateData.addComponentItems(this.name, _name, this.addSection(_name, index));
      comArr.length -= 1;
    } else {
      templateData.addComponentItems(this.name, _name, this.addSection(_name, len));
    }
    window.sessionStorage.setItem('section', JSON.stringify(section))
    window.sessionStorage.setItem('images', JSON.stringify({
      name: this.name, val: _name, index: len,
    }))
    history.push({ pathname: `/addImages/${window.__get__url__id}` })
  };

  // 修改名称
  handleSetName = (value) => {
    this.isRefresh();
    const { templateData } = this.props;
    templateData.setChaptersName(this.name, value)
  };

  // 返回添加的新数据格式
  addSection(_name, index) {
    const text = this.name.includes('scrollBanner') ? 'Banner - ' : 'Picture - ';
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
    const { templateData, history } = this.props;
    const { section } = templateData;
    this.name = this.getSessionName();
    const { config } = section[this.name];
    let text1;
    let text2;
    if (isTypeOf(this.name)) {
      text1 = 'Scroll banner';
      text2 = 'Banner';
    } else {
      text1 = 'Display picture';
      text2 = 'Picture';
    }
    return [
      <SidebarHeader key="add-details-top" history={history}>
        {text1}
      </SidebarHeader>,
      <Section key="add-details-bottom">
        <div className={classes.title}>
          <NameInput click={this.handleSetName} defaultVal={config.title} />
        </div>
        <DragList history={history} name={this.name} refresh={this.isRefresh} />
        <ListView click={this.handleAddSection} styles={styles}>
          <span className={`icon-add ${classes.icon} ${classes.iconColor}`} />
          <span className={`${classes.text} ${classes.bold}`}>Add {text2}</span>
        </ListView>
      </Section>,
    ]
  }
}

AddDetails.wrappedComponent.propTypes = {
  history: PropTypes.object.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
