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
    if (window.__IS__START__REFRESH__) {
      window.__stopRefresh__();
    }
  }

  render() {
    const { templateData, handleEdit } = this.props;
    const { section } = templateData;
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
