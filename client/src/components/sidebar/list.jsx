import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';
import { Modal } from 'antd';

import ListView from '../../base/list/list.jsx';
import ListItem from '../../base/list-item/list-item.jsx';
import { TemplateData } from '../../store/index';
import { deleteUploadImg } from '../../api/http'; // eslint-disable-line

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class List extends React.Component {
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
  handleIsHidden = (value) => {
    const { templateData, isRefresh } = this.props;
    isRefresh();
    templateData.setIsHidden(value);
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
    if (arr.length && img.length) {
      this.toggle(arr, img, name, index)
    } else {
      templateData.deleteChapters(name, index);
    }
  };

  // 区块 修改功能 点击事件
  handleEdit = (value, index) => {
    const { handleEdit, isRefresh, templateData } = this.props; // eslint-disable-line
    isRefresh();
    templateData.handleDropScroll('loading', index);
    handleEdit(value);
  };

  // 确定删除
  handleOk = () => {
    const { templateData } = this.props;
    const { img, name, index } = this.state;
    console.log(img);
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
    const { templateData } = this.props;
    const { visible, arr } = this.state;
    const { section } = templateData;
    // console.log(' ---------》》》》》》 刷新了');
    return [
      section.sectionsOrder.map((v, i) => (
        <ListView key={v} index={i} isFlex>
          <ListItem
            value={v}
            index={i}
            title={section[v].config.title}
            isHidden={section[v].isHidden}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            handleIsHidden={this.handleIsHidden}
          />
        </ListView>
      )),
      <Modal
        key="sdgdfgdgfdgf"
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

List.wrappedComponent.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  isRefresh: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default List
