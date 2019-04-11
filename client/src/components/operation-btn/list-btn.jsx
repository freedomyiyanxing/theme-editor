import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { viewHeaderData } from '../../static/default-template-data';
import { TemplateData } from '../../store/index';
import PublishContainer from './publish.jsx';
import RevertContainer from './revert.jsx';

import classes from './list-btn.less';

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})
class ListBtn extends React.Component {
  constructor() {
    super()
    this.state = {
      isWho: '',
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isWho } = this.state;
    return isWho !== nextState.isWho;
  }

  // 操作 (返回版本, 查看版本, 预览页面)
  handleClick = (v) => {
    let isWho = '';
    switch (v) {
      case 'Preview':
        this.preview();
        break;
      case 'Publish':
        isWho = 'publish'
        break;
      case 'Revert':
        isWho = 'revert'
        break;
      default:
        // this.preview();
    }
    this.setState({
      isWho,
    })
  }

  // 预览
  preview = () => {
    const { templateData, tooltipToggle } = this.props;
    const { isNewUser, themeId } = templateData
    console.log('预览吧...', templateData.isNewUser)
    // 如果是isNewUser为false 或者 没做操作 就不进
    if (isNewUser || !window.__IS__START__REFRESH__) {
      tooltipToggle()
    } else {
      window.open(`business/store_themes/preview/${themeId}`, '_blank')
    }
  }

  cancelModal = () => {
    this.setState({
      isWho: '',
    })
  }

  render() {
    const { templateData } = this.props;
    const { isWho } = this.state;
    const { themeId } = templateData;
    console.log('shuaxinl,a ')
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
            ? <PublishContainer themeId={themeId} cancel={this.cancelModal} />
            : isWho === 'revert'
              ? <RevertContainer template={templateData} cancel={this.cancelModal} />
              : null
        }
      </div>
    )
  }
}

ListBtn.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
  tooltipToggle: PropTypes.func.isRequired,
};

export default ListBtn
