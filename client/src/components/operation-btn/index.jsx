import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown, Spin, notification, Tooltip,
} from 'antd';
import { inject } from 'mobx-react';
import { TemplateData } from '../../store/index';
import { post } from '../../api/http';
import { promptMsg } from '../../common/js/prompt-message';
import ListBtn from './list-btn.jsx';

import classes from './index.less'

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})
class BottomBtn extends React.Component {
  state = {
    loading: false,
    tooltipVisible: false,
  };

  // 提交数据
  handleSave = () => {
    if (window.__IS__START__REFRESH__) { // 没有做如何操作时 不保存
      this.setState({
        tooltipVisible: false,
      });
      this.openNotificationWithIcon('warning', 'Warning', promptMsg._noEdit);
      return;
    }
    const { templateData } = this.props;
    const url = '/business/store_themes/addCustomize';
    this.setState({
      loading: true,
      tooltipVisible: false,
    });
    setTimeout(() => {
      post(url, {
        themeId: templateData.themeId,
        draftData: JSON.stringify(templateData.toJson()),
      })
        .then((resp) => {
          this.setState({
            loading: false,
          });
          templateData.isNewUser = false;
          console.info(resp.data.message)
          this.openNotificationWithIcon('success', 'Success', promptMsg._save);
          // 保存完成移除监听刷新删除的事件
          window.__clearRefreshClick__();
          window.__IS__START__REFRESH__ = true;
        }).catch((err) => {
          this.setState({
            loading: false,
          });
          this.openNotificationWithIcon('error', 'Error', `id 错误... 请刷新 ${err.message}`)
        });
    }, 500)
  }

  // 消息提示框
  openNotificationWithIcon = (type, title, val) => {
    notification[type]({
      message: title,
      description: val,
      duration: 5,
      placement: 'topLeft',
    });
  };

  // 控制tooltip显示隐藏
  tooltipToggle = () => {
    this.setState({
      tooltipVisible: true,
    })
  }

  render() {
    const { history } = this.props;
    const { loading, tooltipVisible } = this.state;
    return (
      <div className={classes.container}>
        <Dropdown
          overlay={(
            <div className={classes.content}>
              <ListBtn tooltipToggle={this.tooltipToggle} history={history} />
            </div>
          )}
          trigger={['click']}
        >
          <span className={classes.item}>
            <span>Actions</span>
            <span className={classes.triangle} />
          </span>
        </Dropdown>
        <Tooltip
          visible={tooltipVisible}
          placement="top"
          title="please click save"
          trigger="contextMenu"
        >
          <span
            role="button"
            tabIndex={0}
            className={classes.item}
          >
            {
              loading
                ? <Spin />
                : (
                  <span
                    tabIndex={0}
                    role="button"
                    className={classes.btn}
                    onClick={this.handleSave}
                  >
                    Save
                  </span>
                )
            }
          </span>
        </Tooltip>
      </div>
    )
  }
}

BottomBtn.wrappedComponent.propTypes = {
  history: PropTypes.object.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default BottomBtn
