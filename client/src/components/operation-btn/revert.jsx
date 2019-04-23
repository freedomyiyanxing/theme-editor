import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Spin, Radio, notification,
} from 'antd';
import moment from 'moment';
import { post, get, CancelToken } from '../../api/http';
import { promptRecover } from '../../common/js/prompt-message';

import classes from './revert.less';

const MSGTEXT = 'Are you sure you want to revert the theme to the selected version？This will discard all changes.';

class RevertContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      data: null,
      isOkBtn: true,
      confirmLoading: false,
    }
  }

  componentDidMount() {
    const { template } = this.props;
    const { themeId } = template
    this._isMounted = true;
    this.revert_1_source = CancelToken.source();
    setTimeout(() => {
      get(
        '/business/store_themes/getThemeHistorys',
        { themeId },
        this.revert_1_source.token,
      )
        .then((resp) => {
          this.revert_1_source = null;
          if (this._isMounted) {
            this.setState({
              data: resp.data,
            })
          }
        })
        .catch(() => {
          this.revert_1_source = null;
        });
    }, 500)
  }

  componentWillUnmount() {
    this._isMounted = false
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

  // 直接关闭
  handleCancel = () => {
    const { cancel } = this.props;
    if (this.revert_1_source) {
      this.revert_1_source.cancel('操作取消成功...1');
    }
    cancel()
  }

  // 提交publish版本信息
  handlePublishSave = () => {
    const { template, cancel, history } = this.props;
    const { themeId } = template
    const { data, value } = this.state;
    this._isMounted = true;
    this.setState({
      confirmLoading: true,
    })
    setTimeout(() => {
      post('/business/store_themes/revert', {
        themeId,
        historyId: data[value].id,
      })
        .then((resp) => {
          if (resp.data.message === 'Success!') {
            if (this._isMounted) {
              this.setState({
                confirmLoading: false,
              })
            }
            cancel()
            history.push({ pathname: `/index/${themeId}` })
            template.setRevert(JSON.parse(data[value].configData))
            this.openNotificationWithIcon('success', 'Success', promptRecover(data[value].verNO));
          }
        })
        .catch((err) => {
          if (this._isMounted) {
            this.setState({
              confirmLoading: false,
            })
          }
          cancel()
          this.openNotificationWithIcon('error', 'Error', err.toString())
        })
    }, 500)
  }

  // radio 选择
  handleChange = (e) => {
    this.setState({
      value: e.target.value,
      isOkBtn: false,
    })
  }

  render() {
    const {
      data, isOkBtn, confirmLoading, value,
    } = this.state;
    const RadioGroup = Radio.Group;
    return (
      <Modal
        key="modal"
        width={900}
        title="Revert Theme"
        visible
        okText="Submit"
        okButtonProps={{ disabled: isOkBtn }}
        onOk={this.handlePublishSave}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
        destroyOnClose
      >
        <div className={classes.modalContent}>
          {
            !data
              ? <Spin />
              : (
                <div className={classes.revertContent}>
                  <div className={classes.revertHeader}>
                    <span />
                    <span>Version</span>
                    <span>Publish Date</span>
                    <span>Remarks</span>
                  </div>
                  <RadioGroup
                    name="radiogroup"
                    className={classes.groupContainer}
                    value={value}
                    onChange={this.handleChange}
                  >
                    {
                      data.map((v, i) => (
                        <Radio
                          key={v.id}
                          value={i}
                          tabIndex={i}
                          role="button"
                          className={classes.revertItem}
                        >
                          <span>
                            <span className={classes.revertVersion}>
                              V{v.verNO}
                            </span>
                          </span>
                          <span>
                            <span className={classes.revertDate}>
                              {moment(v.createdDate).format('YYYY-MM-DD HH:mm:ss')}
                            </span>
                          </span>
                          <span>{v.remark}</span>
                        </Radio>
                      ))
                    }
                  </RadioGroup>
                </div>
              )
          }
        </div>
        <div className={classes.msgContainer}>
          <h2>Tips</h2>
          <p>{MSGTEXT}</p>
        </div>
      </Modal>
    )
  }
}

RevertContainer.propTypes = {
  template: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default RevertContainer
