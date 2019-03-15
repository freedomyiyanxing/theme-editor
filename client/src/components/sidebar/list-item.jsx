import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Modal } from 'antd';
import {
  inject,
  observer,
} from 'mobx-react';

import { TemplateData } from '../../store/index';
import { chapterType, iconName } from '../../common/js/util';
import { deleteUploadImg } from '../../api/http';

import classes from '../../base/list-item/list-item.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class ListItem extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      arr: null,
      img: null,
      name: '',
      index: null,
    }
  }

  // 区块 隐藏 显示 点击事件
  handleIsHidden = (value, index) => {
    const { templateData, isRefresh } = this.props;
    isRefresh();
    templateData.setIsHidden(value, index);
  };

  // 区块 删除功能 点击事件
  handleDelete = (name, index) => {
    const { templateData, isRefresh } = this.props;
    isRefresh();
    const { modules, modulesOrder } = templateData.section[name].config;
    const arr = []; // 保存着 已有图片 的名称
    const img = []; // 保存着 图片路径 方便删除
    for (let i = 0; i < modulesOrder.length; i += 1) {
      const { config } = modules[i][modulesOrder[i]];
      if (config.imgPath) {
        arr.push(config.title);
        img.push(config.imgPath);
      }
    }
    // 判断时候 当前数据下面 是否有图片
    if (arr.length && img.length) {
      this.toggle(arr, img, name, index)
    } else {
      templateData.deleteChapters(name, index);
    }
  };

  // 区块 修改功能 点击事件
  handleEdit = (value, index) => {
    // 只有 picture 和 banner 才允许 修改, 其他暂时屏蔽掉
    if (!(value.startsWith('displayPicture') || value.startsWith('scrollBanner'))) return;
    const { handleEdit, isRefresh, templateData } = this.props;
    isRefresh();
    // 回到滚动位置
    templateData.utilScroll(templateData.utilScrollVal(index))
    handleEdit(value);
  };

  // 确定删除
  handleOk = () => {
    const { templateData } = this.props;
    const { img, name, index } = this.state;
    deleteUploadImg(img)
      .then((resp) => {
        if (resp.data.message === 'Success!') {
          templateData.deleteChapters(name, index)
        }
      }).catch((err) => {
        console.log(err)
      });
    this.toggle();
  };

  // 取消删除
  handleCancel = () => {
    this.toggle();
  };

  // 控制弹出框
  toggle = (arr, img, name, index) => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      arr,
      img,
      name,
      index,
    })
  };

  render() {
    const { value, index, templateData } = this.props;
    const { section } = templateData;
    const { visible, arr } = this.state;
    return [
      <div key={uuid()} className={classes.container}>
        <div
          className={classes.left}
          tabIndex={index}
          role="button"
          onClick={() => { this.handleEdit(value, index) }}
        >
          <span className={`${classes.icon} icon-${iconName(value)}`} />
          <span className={classes.text}>{section[value].config.title}</span>
        </div>
        <div className={classes.right}>
          <span
            tabIndex={0}
            role="button"
            onClick={() => { this.handleIsHidden(value, index) }}
            className={section[value].isHidden ? 'icon-hidden' : 'icon-block'}
          />
          {
            chapterType(value)
              ? (
                <span
                  className="icon-edit"
                  tabIndex={index}
                  role="button"
                  onClick={() => { this.handleEdit(value, index) }}
                />
              )
              : null
          }
          {
            chapterType(value)
              ? (
                <span
                  className="icon-delete"
                  tabIndex={0}
                  role="button"
                  onClick={() => { this.handleDelete(value, index) }}
                />
              )
              : null
          }
          <span className="icon-drag" />
        </div>
      </div>,
      <Modal
        key={uuid()}
        title="Basic Modal"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>你确定要删除 “{arr && arr.join(', ')}” 吗？ 如果确定删除了 则不能返回了</div>
      </Modal>,
    ]
  }
}

ListItem.wrappedComponent.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  handleEdit: PropTypes.func.isRequired,
  isRefresh: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};


export default ListItem
