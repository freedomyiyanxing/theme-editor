import React from 'react';
import uuid from 'uuid';
import ListBar from '../sidebar/list-bar.jsx';
import AddModule from '../add-module/add-module.jsx';
import AddDetails from '../add-details/add-details.jsx';
import AddImages from '../add-img/add-img.jsx';

import BottomBtn from '../../base/bottom-btn/bottomBtn.jsx';

import classes from './left-operation.less';

const PAGE_NAME = {
  home: 'home',
  module: 'module',
  details: 'details',
  addImg: 'add-images',
};

export default class LeftOperation extends React.Component {
  constructor() {
    super();
    this.state = {
      name: PAGE_NAME.home,
      addSection: null,
    }
  }

  // 进入编辑页面 (add-details)
  handelHomeEdit = (val) => {
    this.setState({
      name: PAGE_NAME.details,
      addSection: val,
      addImgName: {},
    })
  };

  // 进入添加页面 (add-module)
  handleHomeAdd = () => {
    this.setState({
      name: PAGE_NAME.module,
    })
  };

  // 进入添加图片页面 (add-img)
  handleAddImg = (index, val, name) => {
    this.setState({
      name: PAGE_NAME.addImg,
      addImgName: {
        index,
        val,
        name,
      },
    })
  };

  // 后退
  backClick = (name) => {
    this.setState({
      name,
    })
  };

  render() {
    const { name, addSection, addImgName } = this.state;
    return [
      <div key={uuid()} className={classes.container}>
        {
          name === PAGE_NAME.home
            ? <ListBar handleEdit={this.handelHomeEdit} handleAdd={this.handleHomeAdd} />
            : name === PAGE_NAME.module
              ? <AddModule backClick={this.backClick} click={this.handelHomeEdit} />
              : name === PAGE_NAME.details
                ? (
                  <AddDetails
                    name={addSection}
                    click={this.handleAddImg}
                    backClick={this.backClick}
                  />
                )
                : name === PAGE_NAME.addImg
                  ? <AddImages obj={addImgName} backClick={this.backClick} />
                  : null
        }
      </div>,
      <BottomBtn key={uuid()} />,
    ]
  }
}
