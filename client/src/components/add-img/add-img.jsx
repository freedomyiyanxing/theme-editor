/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
} from 'mobx-react';

import Section from '../../base/slidebar-section/section.jsx';
import SidebarHeader from '../../base/sidebar-header/sidebar-header.jsx';
import NameInput from '../../base/input/name-input.jsx';
import UrlInput from '../../base/input/url-input.jsx';
import DateInput from '../../base/input/date-input.jsx';
import UploadIndex from '../../base/upload/upload.jsx';
import { isTypeOf } from '../../common/js/util';
import { TemplateData } from '../../store/index';

import classes from './add-img.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

export default class AddImages extends React.Component {
  constructor(props) {
    super(props);
    const { templateData } = this.props;
    this.obj = this.getSessionName();
    const { config } = templateData.section[this.obj.name].config.modules[this.obj.index][this.obj.val];
    const eff = 'effDate';
    const exp = 'expDate';
    if (!(config[eff] && config[exp])) { // 当前时间数据为null时, 设置默认时间
      this.stateDate = new Date().getTime();
      this.endDate = new Date('2099-12-29 23:59:59').getTime();
      templateData.setImgInvalidDate(this.obj, this.stateDate, eff);
      templateData.setImgInvalidDate(this.obj, this.endDate, exp);
    } else { // 已有时间数据
      this.stateDate = config[eff];
      this.endDate = config[exp];
    }
  }

  // 修改名称
  handleSetName = (val) => {
    this.isRefresh()
    const { templateData } = this.props;
    templateData.setComponentName(this.obj, val);
  };

  // 获取 url
  handleGetUrl = (val) => {
    this.isRefresh()
    const { templateData } = this.props;
    templateData.setComponentUrl(this.obj, val);
  };

  /*  开始时间 调用 */
  // 点击ok时调用
  startOnOk = (val) => {
    this.isRefresh()
    const { templateData } = this.props;
    const date = new Date(val._d).getTime();
    templateData.setImgInvalidDate(this.obj, date, 'effDate');
  };

  // 这个选择时调用
  startHandleChange = (val, dateString) => {
    this.isRefresh()
    const { templateData } = this.props;
    const date = new Date(dateString).getTime();
    templateData.setImgInvalidDate(this.obj, date, 'effDate');
  };
  /*  开始时间 调用 */


  /*  结束时间 调用 */
  // 点击ok时调用
  endOnOk = (val) => {
    this.isRefresh()
    const { templateData } = this.props;
    const date = new Date(val._d).getTime();
    templateData.setImgInvalidDate(this.obj, date, 'expDate');
  };

  // 这个选择时调用
  endHandleChange = (val, dateString) => {
    this.isRefresh()
    const { templateData } = this.props;
    const date = new Date(dateString).getTime();
    templateData.setImgInvalidDate(this.obj, date, 'expDate');
  };
  /*  开始时间 调用 */

  getSessionName() {
    if (window.sessionStorage) {
      const obj = window.sessionStorage.getItem('images')
      return JSON.parse(obj);
    }
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
    const { config } = section[this.obj.name].config.modules[this.obj.index][this.obj.val];
    const isBanner = isTypeOf(this.obj.name);
    const text = isBanner  ? 'Banner' : 'Picture';
    return [
      <SidebarHeader key={uuid()} history={history}>
        Edit {text}
      </SidebarHeader>,
      <Section key={uuid()}>
        <div className={classes.wrapper}>
          <div className={classes.items}>
            <NameInput click={this.handleSetName} defaultVal={config.title} />
          </div>
          <div className={classes.items}>
            <UrlInput click={this.handleGetUrl} defaultVal={config.url} />
          </div>
          <div className={classes.items}>
            <DateInput
              title="Eff Date"
              current={this.stateDate}
              onOk={this.startOnOk}
              onChange={this.startHandleChange}
            />
          </div>
          <div className={classes.items}>
            <DateInput
              title="Exp Date"
              current={this.endDate}
              onOk={this.endOnOk}
              onChange={this.endHandleChange}
            />
          </div>
          <div className={classes.items}>
            <UploadIndex obj={this.obj} isTypeOf={isBanner} />
          </div>
        </div>
      </Section>,
    ]
  }
}

AddImages.wrappedComponent.propTypes = {
  history: PropTypes.object.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
