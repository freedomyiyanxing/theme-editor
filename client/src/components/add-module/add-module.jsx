import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { Collapse } from 'antd';
import {
  inject,
} from 'mobx-react';

import { TemplateData } from '../../store/index';
import SidebarHeader from '../../base/sidebar-header/sidebar-header.jsx';
import ListView from '../../base/list/list.jsx';
import { displayPicture, slideImagesData } from '../../static/default-template-data.js';

import classes from './add-module.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

export default class AddModule extends React.Component {
  callback = (key) => {
    let n = 0;
    if (key.length) {
      n = 180;
    }
    this.iconDropDown.style.transform = `rotate(${n}deg)`;
  };

  /**
   * 添加 display picture
   * @param index 当前选择的样式下标
   */
  handleAddPicture = (index) => {
    const name = `displayPicture${uuid().slice(0, 8)}`;
    this.addObj(name, index + 1)
  };

  /**
   * 添加 scrollBanner
   */
  handleAddScrollBanner = () => {
    const name = `scrollBanner${uuid().slice(0, 8)}`;
    this.addObj(name);
  };

  // 给stare 添加一个章节默认对象
  addObj(name, index) {
    const { templateData, click } = this.props;
    let obj;
    if (index) {
      obj = {
        type: `images-${index}`,
        isHidden: true,
        config: slideImagesData[`images${index}`],
      }
    } else {
      obj = {
        type: 'slideshow',
        isHidden: true,
        config: slideImagesData.slideshow,
      };
    }
    templateData.saveTemplateData(obj, name); // 添加数据
    click(name) // 跳转页面
  }

  render() {
    const { backClick } = this.props;
    const { Panel } = Collapse;
    return [
      <SidebarHeader key={uuid()} click={() => { backClick('home') }}>
        Add / section
      </SidebarHeader>,
      <section key={uuid()} className={classes.container}>
        <div className={classes.scroll}>
          <ListView>
            <div className={classes.left}>
              <span className={`icon-scrollBanner ${classes.icon}`} />
              <span className={classes.text}>Scroll banner</span>
            </div>
            <div className={classes.right}>
              <span
                role="button"
                tabIndex={0}
                className="button-black"
                onClick={this.handleAddScrollBanner}
              >
                Add
              </span>
            </div>
          </ListView>
        </div>
        <Collapse
          onChange={this.callback}
          bordered={false}
        >
          <Panel
            key="1"
            showArrow={false}
            header={[
              <span key="icon-displayPicture" className={classes.listLeft}>
                <span className={`icon-displayPicture ${classes.icon}`} />
                <span className={classes.text}>Display picture</span>
              </span>,
              <span
                key="icon-drop-down"
                className={`icon-drop-down ${classes.iconDropDown}`}
                ref={n => this.iconDropDown = n}
              />,
            ]}
          >
            <ul>
              {
                displayPicture.map((v, i) => (
                  <li key={uuid()} className={classes.display}>
                    <span className={classes.displayL}>
                      <div className={classes.displayS}>
                        <span className={`icon-style${i + 1}`} />
                      </div>
                      <span>Style {i + 1}</span>
                    </span>
                    <span
                      role="button"
                      tabIndex={i}
                      className={classes.displayR}
                      onClick={() => { this.handleAddPicture(i) }}
                    >
                      <span className="button-black">Add</span>
                    </span>
                  </li>
                ))
              }
            </ul>
          </Panel>
        </Collapse>
      </section>,
    ]
  }
}

AddModule.wrappedComponent.propTypes = {
  click: PropTypes.func.isRequired,
  backClick: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};
