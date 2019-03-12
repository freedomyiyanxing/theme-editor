import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';
import { Modal } from 'antd';

import ListView from '../list/list.jsx';
import { TemplateData } from '../../store/index';
import classes from './list-item.less';
import { isTypeOf, getNumber } from '../../common/js/util';
import { deleteUploadImg } from '../../api/http';

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
    const { click, name } = this.props;
    click(index, val, name);
  };

  // 删除
  handleDelete = (index) => {
    const { templateData, name } = this.props;
    const { modules, modulesOrder } = templateData.section[name].config;
    if (modulesOrder.length > 1) {
      // 判断 如果有 图片 则 弹出提示框;
      if (modules[index][modulesOrder[index]].config.imgPath) {
        this.toggle(modules[index][modulesOrder[index]].config.title, index);
      } else {
        // 把删除的掉编号保存在store 中
        templateData.setComponentItems(name, getNumber(modulesOrder[index]));
        // 在修改值
        templateData.deleteComponent(name, index);
      }
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

  // 控制弹出框
  toggle = (val, index) => {
    const { visible } = this.state;
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
    const icon = isTypeOf(name) ? 'scrollBanner' : 'displayPicture';
    return [
      modulesOrder.map((v, i) => (
        <ListView key={v} isFlex index={v}>
          <div className={classes.container}>
            <div className={classes.left}>
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
        key="sdgdfgdgfdgf"
        title="Basic Modal"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div>你确定要删除 “{val}” 吗？ 如果确定删除了 则不能返回了</div>
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
