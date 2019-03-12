import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
} from 'mobx-react';

import { TemplateData } from '../../store/index';
import SidebarHeader from '../../base/sidebar-header/sidebar-header.jsx';
import NameInput from '../../base/input/name-input.jsx';
import UrlInput from '../../base/input/url-input.jsx';
import DateInput from '../../base/input/date-input.jsx';
import UploadIndex from '../../base/upload/upload.jsx';
import { isTypeOf } from '../../common/js/util';

import classes from './add-img.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

export default class AddImages extends React.Component {
  constructor(props) {
    super(props);
    const { obj, templateData } = this.props;
    const { config } = templateData.section[obj.name].config.modules[obj.index][obj.val];
    const eff = 'effDate';
    const exp = 'expDate';
    if (!(config[eff] && config[exp])) { // 当前时间数据为null
      this.stateDate = new Date().getTime();
      this.endDate = new Date('2099-12-29 23:59:59').getTime();
      templateData.setImgInvalidDate(obj, this.stateDate, eff);
      templateData.setImgInvalidDate(obj, this.endDate, exp);
    } else { // 已有时间数据
      this.stateDate = config[eff];
      this.endDate = config[exp];
    }
  }

  // 修改名称
  handleSetName = (val) => {
    const { obj, templateData } = this.props;
    templateData.setComponentName(obj, val);
  };

  // 获取 url
  handleGetUrl = (val) => {
    const { obj, templateData } = this.props;
    templateData.setComponentUrl(obj, val);
  };

  /*  开始时间 调用 */
  // 点击ok时调用
  startOnOk = (val) => {
    const { obj, templateData } = this.props;
    const date = new Date(val._d).getTime();
    templateData.setImgInvalidDate(obj, date, 'effDate');
  };

  // 这个选择时调用
  startHandleChange = (val, dateString) => {
    const { obj, templateData } = this.props;
    const date = new Date(dateString).getTime();
    templateData.setImgInvalidDate(obj, date, 'effDate');
  };
  /*  开始时间 调用 */


  /*  结束时间 调用 */
  // 点击ok时调用
  endOnOk = (val) => {
    const { obj, templateData } = this.props;
    const date = new Date(val._d).getTime();
    templateData.setImgInvalidDate(obj, date, 'expDate');
  };

  // 这个选择时调用
  endHandleChange = (val, dateString) => {
    const { obj, templateData } = this.props;
    const date = new Date(dateString).getTime();
    templateData.setImgInvalidDate(obj, date, 'expDate');
  };
  /*  开始时间 调用 */

  // handleSubmit = () => {
  //   const { obj, templateData } = this.props;
  //   const { config } = templateData.section[obj.name].config.modules[obj.index][obj.val];
  //   console.log(config)
  // };

  render() {
    const { backClick, obj, templateData } = this.props;
    const { section } = templateData;
    const { config } = section[obj.name].config.modules[obj.index][obj.val];
    console.log(config.title, 'add-img');
    const text = isTypeOf(obj.name) ? 'Scroll banner' : 'Display picture';
    return [
      <SidebarHeader click={() => { backClick('details') }} key={uuid()}>
        Add / Edit {text}
      </SidebarHeader>,
      <section className={classes.container} key={uuid()}>
        <div className={classes.content}>
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
            <div className="add-items">
              <DateInput
                title="Exp Date"
                current={this.endDate}
                onOk={this.endOnOk}
                onChange={this.endHandleChange}
              />
            </div>
            <div className={classes.items}>
              <UploadIndex obj={obj} />
            </div>
          </div>
        </div>
      </section>,
    ]
  }
}

AddImages.wrappedComponent.propTypes = {
  obj: PropTypes.object.isRequired,
  backClick: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
