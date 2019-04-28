import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';
import DragIndex from '../../base/drag/index.jsx';

import ListItem from './list-item.jsx';
import { TemplateData } from '../../store/index';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@DragIndex
class DragList extends React.Component {
  // 点击进入详情事件(add-details)
  handleEdit = (value, index) => {
    // 只有 picture 和 banner 才允许 修改, 其他暂时屏蔽掉
    if (!(value.startsWith('displayPicture') || value.startsWith('scrollBanner'))) return;
    const { templateData, history } = this.props;
    // 回到滚动位置
    templateData.utilScroll(templateData.utilScrollVal(index, index));
    console.log('进入详情')
    window.sessionStorage.setItem('details', value);
    history.push({ pathname: `/addDetails/${window.__get__url__id}` })
  };

  render() {
    const { isRefresh } = this.props;
    return <ListItem isRefresh={isRefresh} handleEdit={this.handleEdit} />
  }
}

DragList.wrappedComponent.propTypes = {
  history: PropTypes.object.isRequired,
  isRefresh: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default DragList
