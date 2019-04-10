/* eslint-disable */
import React from 'react';
import uuid from 'uuid';
import PropTypes from 'prop-types';
import {
  Modal, Spin, Input, notification, Radio,
} from 'antd';
import moment from 'moment';
import { inject } from 'mobx-react';
import { viewHeaderData } from '../../static/default-template-data';
import { post, get, CancelToken } from '../../api/http';
import { TemplateData } from '../../store/index';
import PublishContainer from './publish.jsx';

import classes from './list-btn.less';

const PUBLISHWIDTH = 600; // 对话框宽度
const REVERTWIDTH = 900; // 对话框宽度
const PUBLISHTEXT = 'Publish Theme';
const REVERTTEXT = 'Revert Theme';
const MSGTEXT = [
  'Are you sure you want to publish this theme？This will replace yourcurrent live theme.',
  'Are you sure you want to revert the theme to the selected version？This will discard all changes.',
]

// 发布版本的html
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

// 查看版本信息的html
const revertHtml = (data, selector) => {
  const RadioGroup = Radio.Group;
  return (
    <div className={classes.revertContent}>
      <div className={classes.revertHeader}>
        <span className={classes.revertFirst} />
        <span>Version</span>
        <span>Publish Date</span>
        <span>Remarks</span>
      </div>
      <RadioGroup name="radiogroup" onChange={selector}>
        {
          data.map((v, i) => (
            <Radio
              key={v.id}
              value={i}
              tabIndex={i}
              role="button"
              className={classes.revertItem}
            >
              <span className={classes.revertFirst}>1</span>
              {v.remark}
            </Radio>
          ))
        }
      </RadioGroup>
    </div>
  )
}

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})
class ListBtn extends React.Component {
  state = {
    isWho: '',
  };

  // 操作 (返回版本, 查看版本, 预览页面)
  handleClick = (v) => {
    let isWho = '';
    switch (v) {
      case 'Preview':
        // this.preview();
        break;
      case 'Publish':
        isWho = 'publish'
        // this.publish();
        break;
      case 'Revert':
        // this.revert();
        break;
      default:
        // this.preview();
    }
    this.setState({
      isWho,
    })
  }

  // 弹出提示框
  // toggle = (title, okText, msgText, width) => {
  //   const { visible } = this.state;
  //   if (visible) {
  //     this.setState({
  //       confirmLoading: false,
  //       visible: !visible,
  //     })
  //   } else {
  //     this.setState({
  //       width,
  //       title,
  //       okText,
  //       msgText,
  //       visible: !visible,
  //     })
  //   }
  // };
  //
  // // 消息提示框
  // openNotificationWithIcon = (type, title, val) => {
  //   notification[type]({
  //     message: title,
  //     description: val,
  //     duration: 3,
  //     placement: 'topLeft',
  //   });
  // };

  // 确定关闭
  // handleOk = () => {
  //   const { title } = this.state;
  //   this.setState({
  //     confirmLoading: true,
  //   })
  //   if (title === PUBLISHTEXT) {
  //     this.handlePublishSave()
  //     console.log(`我是${title} '${this.publishMsg}'`)
  //   } else {
  //     console.log(`我是${title}`)
  //   }
  // }
  //
  // // 直接关闭
  // handleCancel = () => {
  //   this.publish_1_source && this.publish_1_source.cancel('操作取消成功...1');
  //   this.revert_1_source && this.revert_1_source.cancel('操作取消成功...2');
  //   this.toggle()
  // }
  //
  // // 输入版本内容
  // publishChange = (e) => {
  //   this.publishMsg = e.target.value
  // }
  //
  // selector = () => {
  //   console.log(1)
  // }

  setIsTwo = () => {
    this.setState({
      isWho: '',
    })
  }

  // 展示编辑完成页面
  // preview() {
  //   console.log('preview')
  // }

  // 查看版本信息
  // publish() {
  //   // const { templateData } = this.props;
  //   // const { themeId } = templateData;
  //   // this.publish_1_source = CancelToken.source();
  //   // this.toggle(PUBLISHTEXT, 'Publish', MSGTEXT[0], PUBLISHWIDTH)
  //   // this.setState({
  //   //   loading: true,
  //   //   isOkBtn: true, // 防止第二次打开时变成可点击
  //   // })
  //   // get(
  //   //   '/business/store_themes/publishModal',
  //   //   { themeId },
  //   //   { cancelToken: this.publish_1_source.token, },
  //   // )
  //   //   .then((resp) => {
  //   //     const { isPublish } = resp;
  //   //     this.setState({
  //   //       loading: false,
  //   //       isOkBtn: !isPublish,
  //   //       html: publishHtml(this.publishChange, resp),
  //   //     });
  //   //     this.publish_1_source = null;
  //   //   })
  //   //   .catch((err) => {
  //   //     this.publish_1_source = null;
  //   //     console.log(err);
  //   //   });
  // }

  /* 回退版本 */
  // 回退版本
  // revert() {
  //   const { templateData } = this.props;
  //   const { themeId } = templateData;
  //   this.revert_1_source = CancelToken.source();
  //   this.toggle(REVERTTEXT, 'Submit', MSGTEXT[1], REVERTWIDTH)
  //   this.setState({
  //     loading: true,
  //   })
  //   setTimeout(() => {
  //     get(
  //       '/business/store_themes/getThemeHistorys',
  //       { themeId },
  //       { cancelToken: this.revert_1_source.token, },
  //     )
  //       .then((resp) => {
  //         this.revert_1_source = null;
  //         console.log(resp.data)
  //         this.setState({
  //           loading: false,
  //           isOkBtn: false,
  //           html: revertHtml(resp.data, this.selector),
  //         })
  //       })
  //       .catch((err) => {
  //         this.revert_1_source = null;
  //         console.log(err);
  //       });
  //   }, 500)
  // }
  //
  // // 提交publish版本信息
  // handlePublishSave() {
  //   const { templateData } = this.props;
  //   const { themeId } = templateData;
  //   post('/business/store_themes/publish', {
  //     themeId,
  //     remark: this.publishMsg,
  //   })
  //     .then(() => {
  //       this.setState({
  //         visible: false,
  //         confirmLoading: false,
  //       })
  //       this.openNotificationWithIcon('success', 'Success', '发布版本成功 可回到上个窗口查看');
  //       // window.opener.__refresh__page__()
  //     })
  //     .catch(() => {
  //       this.setState({
  //         visible: false,
  //         confirmLoading: false,
  //       })
  //       this.openNotificationWithIcon('error', 'Error', '发布版本失败...')
  //     })
  // }

  render() {
    const { templateData } = this.props;
    const {
      visible, loading, title, html, okText, isOkBtn,
      confirmLoading, msgText, width, isWho,
    } = this.state;
    const { themeId } = templateData;
    console.log('是否刷新了', isWho)
    return (
      <div>
        {
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
          ))
        }
        {
          isWho === 'publish'
            ? <PublishContainer themeId={themeId} cancel={this.setIsTwo} />
            : null
        }
      </div>
    )
  }
}

ListBtn.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default ListBtn
