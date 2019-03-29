import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import {
  inject,
  observer,
} from 'mobx-react';
import { Modal } from 'antd';

import ListView from '../list/list.jsx';
import { TemplateData } from '../../store/index';
import { isTypeOf, getNumber } from '../../common/js/util';
import { deleteUploadImg } from '../../api/http';

import classes from './list-item.less';

// 限制删除
const LimitNumber = {
  images_1: 1, // picture 中的 style-1 最少一个
  images_2: 5, // picture 中的 style-2 最少五个
  images_3: 5, // picture 中的 style-3 最少五个
  images_4: 5, // picture 中的 style-4 最少五个
  images_5: 2, // picture 中的 style-5 最少四个
  slideshow: 1, // scroll-banner 最少一个
}

const PromptText = (name, type) => {
  let text;
  if (type === 'img') {
    text = `你确定要删除 “${name}” 吗? 它里面可有图片哟, 如果确定删除了 则不能返回了`
  } else {
    text = `${name} 样式至少得有 " ${LimitNumber[name]} " 张图片来摆设`
  }
  return text;
}

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer class DetailsListItem extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      index: null,
      val: '',
    }
  }

  // 进入添加图片页面
  handleEdit = (val, index) => {
    const { click, name } = this.props; // eslint-disable-line
    click(index, val, name);
  };

  // 删除
  handleDelete = (index) => {
    const { templateData, name } = this.props;
    const { modules, modulesOrder } = templateData.section[name].config;
    const { type } = templateData.section[name];
    if (modulesOrder.length > LimitNumber[type]) {
      // 判断 如果有 图片 则 弹出提示框;
      if (modules[index][modulesOrder[index]].config.imgPath) {
        this.toggle(modules[index][modulesOrder[index]].config.title, index, 'img');
      } else {
        // 把删除的掉编号保存在store 中
        templateData.setComponentItems(name, getNumber(modulesOrder[index]));
        // 在修改值
        templateData.deleteComponent(name, index);
      }
    } else {
      this.toggle(type, index, 'ele')
    }
  };

  // 隐藏
  handleIsHidden = (val, index) => {
    const { templateData, name } = this.props;
    templateData.setComponentIsHidden(name, val, index)
  };

  // 确定删除
  handleOk = () => {
    const { templateData, name } = this.props;
    const { modules, modulesOrder } = templateData.section[name].config;
    const { index } = this.state;
    deleteUploadImg(modules[index][modulesOrder[index]].config.imgPath)
      .then((resp) => {
        if (resp.data.message === 'Success!') {
          // 把删除的掉编号保存在store 中
          templateData.setComponentItems(name, getNumber(modulesOrder[index]));
          // 清除数据
          templateData.deleteComponent(name, index);
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

  /**
   * 控制弹出框
   * @param name  当前名称
   * @param index 索引
   * @param type 类型
   */
  toggle = (name, index, type) => {
    const { visible } = this.state;
    const val = PromptText(name, type)
    this.setState({
      visible: !visible,
      val,
      index,
    })
  };

  render() {
    const { name, templateData } = this.props;
    const { visible, val } = this.state;
    const { section } = templateData;
    const { config } = section[name];
    const { modules, modulesOrder } = config;
    const icon = isTypeOf(name) ? 'scrollBanner-single' : 'displayPicture-single';
    return [
      modulesOrder.map((v, i) => (
        <ListView key={uuid()} isFlex index={v}>
          <div className={classes.container}>
            <div
              tabIndex={i}
              role="button"
              onClick={() => { this.handleEdit(v, i) }}
              className={classes.left}
            >
              <span className={`${classes.icon} icon-${icon}`} />
              <span className={classes.text}>
                {modules[i][v].config.title}
              </span>
            </div>
            <div className={classes.right}>
              <span
                tabIndex={i}
                role="button"
                className={modules[i][v].config.isShow ? 'icon-hidden' : 'icon-block'}
                onClick={() => { this.handleIsHidden(v, i) }}
              />
              <span
                className="icon-edit"
                tabIndex={i}
                role="button"
                onClick={() => { this.handleEdit(v, i) }}
              />
              <span
                className="icon-delete"
                tabIndex={i}
                role="button"
                onClick={() => { this.handleDelete(i) }}
              />
              <span className="icon-drag" />
            </div>
          </div>
        </ListView>
      )),
      <Modal
        key={uuid()}
        title="Basic Modal"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>{val}</div>
      </Modal>,
    ]
  }
}

DetailsListItem.wrappedComponent.propTypes = {
  name: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default DetailsListItem
