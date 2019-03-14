import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';
// import Sortable from 'sortablejs';

import { TemplateData } from '../../store/index';
import SidebarHeader from '../../base/sidebar-header/sidebar-header.jsx';
import NameInput from '../../base/input/name-input.jsx';
import ListView from '../../base/list/list.jsx';
import DetailsListItem from '../../base/list-item/details-list.jsx';
import { isTypeOf } from '../../common/js/util';

import classes from './add-details.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

@observer export default class AddDetails extends React.Component {
  componentDidMount() {
    // const { templateData, name } = this.props;
    // new Sortable(this.wrapper, {
    //   handle: '.icon-drag',
    //   onStart: (evt) => {
    //     console.log(evt, ' -> 拖拽 -- 开始')
    //   },
    //   onChange: (evt) => {
    //     console.log(evt.newIndex, ' -> 拖拽  -- 中')
    //   },
    //   onEnd: (evt) => {
    //     const { oldIndex, newIndex } = evt;
    //     // 如果相等 则表示没有拖动
    //     if (oldIndex === newIndex) {
    //       console.log('没有拖动...')
    //     } else {
    //       // 更新数据
    //       templateData.componentItemsSort(
    //         name,
    //         oldIndex,
    //         newIndex,
    //       )
    //     }
    //   },
    // })
  }

  // 添加
  handleAddSection = () => {
    const { templateData, name } = this.props;
    const { section, componentItems } = templateData;
    const { modulesOrder } = section[name].config;
    const len = modulesOrder.length;
    /*
    * 如果有 componentItems[name]这个数组 且 数组它不等于空
    * 则说明已经操作过删除,  否则根据下标累加数据
    */
    if (componentItems[name] && componentItems[name].length) {
      const comArr = componentItems[name];
      const index = comArr[comArr.length - 1];
      const _name = `modules${index}`;
      templateData.addComponentItems(name, _name, this.addSection(name, _name, index));
      comArr.length -= 1;
    } else {
      const _name = `modules${len}`;
      templateData.addComponentItems(name, _name, this.addSection(name, _name, len));
    }
  };

  // 修改名称
  handleSetName = (value) => {
    const { templateData, name } = this.props;
    templateData.setChaptersName(name, value)
  };

  // 添加 section
  addSection(name, _name, index) {
    const text = name.includes('scrollBanner') ? 'Banner - ' : 'Picture - ';
    return {
      [_name]: {
        config: {
          title: text + (index + 1),
          url: null,
          isShow: true,
          effDate: null,
          expDate: null,
          imgPath: null,
        },
      },
    };
  }

  render() {
    const {
      templateData, backClick, name, click,
    } = this.props;
    const { section } = templateData;
    const { config } = section[name];
    let text1;
    let text2;
    if (isTypeOf(name)) {
      text1 = 'Scroll banner';
      text2 = 'Banner';
    } else {
      text1 = 'Display picture';
      text2 = 'Picture';
    }
    return [
      <SidebarHeader key="add-details-top" click={() => { backClick('home') }}>
        {text1}
      </SidebarHeader>,
      <section key="add-details-bottom" className={classes.container}>
        <div className={classes.content}>
          <div className={classes.title}>
            <NameInput click={this.handleSetName} defaultVal={config.title} />
          </div>
          <div ref={n => this.wrapper = n}>
            <DetailsListItem name={name} click={click} />
          </div>
          <div className={classes.handle}>
            <ListView click={this.handleAddSection}>
              <span className={`icon-add ${classes.icon}`} />
              <span className={classes.text}>Add {text2}</span>
            </ListView>
          </div>
        </div>
      </section>,
    ]
  }
}

AddDetails.wrappedComponent.propTypes = {
  name: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired,
  backClick: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
