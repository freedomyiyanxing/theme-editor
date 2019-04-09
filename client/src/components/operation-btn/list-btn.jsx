import React from 'react';
import uuid from 'uuid';
import PropTypes from 'prop-types';
import { Modal, Spin, Input } from 'antd';
import moment from 'moment';
import { inject } from 'mobx-react';
import { viewHeaderData } from '../../static/default-template-data';
import { post, get } from '../../api/http';
import { TemplateData } from '../../store/index';

import classes from './list-btn.less';

const PUBLISTTEXT = 'Publish Theme';
const REVERTTEXT = 'Revert Theme';
const MSGTEXT = [
  'Are you sure you want to publish this theme？This will replace yourcurrent live theme.',
  'Are you sure you want to revert the theme to the selected version？This will discard all changes.',
]

const publishHtml = (change, data) => {
  let version = '';
  let date = '';
  if (typeof data.version === 'number' && typeof data.publishDate === 'number') {
    version = data.version.toFixed(1);
    date = moment(data.publishDate).format('YYYY-MM-DD HH:mm:ss');
  }
  return [
    <div key={uuid()} className={classes.formContainer}>
      <span className={classes.formText}>Version:</span>
      <Input disabled defaultValue={version} />
    </div>,
    <div key={uuid()} className={classes.formContainer}>
      <span className={classes.formText}>Publish Date:</span>
      <Input disabled defaultValue={date} />
    </div>,
    <div key={uuid()} className={classes.formContainer}>
      <span className={classes.formText}>Remarks:</span>
      <Input onChange={change} />
    </div>,
  ]
}

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})
class ListBtn extends React.Component {
  state = {
    visible: false,
    loading: false,
    title: '',
    html: null,
    okText: '',
    isOkBtn: false,
    confirmLoading: false,
    msgText: '',
  };

  // 操作 (返回版本, 查看版本, 预览页面)
  handleClick = (v) => {
    switch (v) {
      case 'Preview':
        this.preview();
        break;
      case 'Publish':
        this.publish();
        break;
      case 'Revert':
        this.revert();
        break;
      default:
        this.preview();
    }
  }

  // 弹出提示框
  toggle = (title, okText, msgText) => {
    const { visible } = this.state;
    if (visible) {
      console.log('释放了')
      this.setState({
        confirmLoading: false,
        visible: !visible,
      })
      this._isMounted = false;
    } else {
      this.setState({
        title,
        okText,
        msgText,
        visible: !visible,
      })
    }
  };

  // 确定关闭
  handleOk = () => {
    const { title } = this.state;
    this.setState({
      confirmLoading: true,
    })
    if (title === PUBLISTTEXT) {
      // this.handlePublishSave()
      console.log(`我是${title} '${this.publishMsg}'`)
    } else {
      console.log(`我是${title}`)
    }
    // this.toggle();
  }

  handleCancel = () => {
    this.toggle()
  }

  // 输入版本内容
  publishChange = (e) => {
    this.publishMsg = e.target.value
  }

  // 展示编辑完成页面
  preview() {
    console.log('preview')
  }

  // 查看版本信息
  publish() {
    const { templateData } = this.props;
    const { themeId } = templateData;
    this.toggle(PUBLISTTEXT, 'Publish', MSGTEXT[0])
    this.setState({
      loading: true,
    })
    setTimeout(() => {
      get('/business/store_themes/publishModal', { themeId })
        .then((resp) => {
          const { isPublish } = resp;
          console.log(resp.isPublish)
          this.setState({
            loading: false,
            isOkBtn: !isPublish,
            html: publishHtml(this.publishChange, resp),
          })
        })
        .catch((err) => {
          this.setState({
            loading: false,
            html: '错误',
          })
          console.log(err);
        });
    }, 500)
  }

  // 回退版本
  revert() {
    const { templateData } = this.props;
    const { themeId } = templateData;
    this.toggle(REVERTTEXT, 'Submit', MSGTEXT[0])
    this.setState({
      loading: true,
    })
    setTimeout(() => {
      get('/business/store_themes/themeHistorys', { themeId })
        .then((resp) => {
          // const { isPublish } = resp;
          console.log(resp)
          // this.setState({
          //   loading: false,
          //   isOkBtn: !isPublish,
          //   html: publishHtml(this.publishChange, resp),
          // })
        })
        .catch((err) => {
          this.setState({
            loading: false,
            html: '错误',
          })
          console.log(err);
        });
    }, 500)
  }

  // 提交publish版本信息
  handlePublishSave() {
    const { templateData } = this.props;
    const { themeId } = templateData;
    setTimeout(() => {
      post('/business/store_themes/publish', {
        themeId,
      })
        .then((resp) => {
          console.log(resp)
        })
        .catch((err) => {
          console.log(err)
        })
    }, 500)
  }

  render() {
    const {
      visible, loading, title, html, okText, isOkBtn,
      confirmLoading, msgText,
    } = this.state;
    console.log(111111)
    return [
      viewHeaderData.map((v, i) => (
        <span
          key={v.icon}
          role="button"
          tabIndex={i}
          className={classes.btnItems}
          onClick={() => { this.handleClick(v.text) }}
        >
          <span className={`${v.icon} ${classes.icon}`} />
          <span className={classes.text}>{v.text}</span>
        </span>
      )),
      <Modal
        key="modal"
        title={title}
        visible={visible}
        okText={okText}
        okButtonProps={{ disabled: isOkBtn }}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
      >
        <div className={classes.modalContent}>
          {
            loading
              ? <Spin />
              : html
          }
        </div>
        <div className={classes.msgContainer}>
          <h2>Tips</h2>
          <p>{msgText}</p>
        </div>
      </Modal>,
    ]
  }
}

ListBtn.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default ListBtn
