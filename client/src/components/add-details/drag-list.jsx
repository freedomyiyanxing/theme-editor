import React from 'react';
import PropTypes from 'prop-types';
import DragIndex from '../../base/drag/index.jsx';
import DetailsListItem from './details-list.jsx';

@DragIndex
class DragList extends React.Component {
  // 进入添加图片页面
  handleEdit = (val, index) => {
    const { history, name } = this.props;
    window.sessionStorage.setItem('images', JSON.stringify({ name, val, index }));
    history.push({ pathname: `/addImages/${window.__get__url__id}` })
  }

  render() {
    const { name, refresh } = this.props;
    return <DetailsListItem name={name} handleEdit={this.handleEdit} refresh={refresh} />
  }
}

DragList.propTypes = {
  name: PropTypes.string.isRequired,
  refresh: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default DragList
