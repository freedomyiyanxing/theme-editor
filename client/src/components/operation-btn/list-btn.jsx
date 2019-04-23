import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { viewHeaderData } from '../../common/js/default-template-data';
import { TemplateData } from '../../store/index';
import { get } from '../../api/http';
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
        this.preview();
    }
    this.setState({
      isWho,
    })
  }

  // 预览
  preview = () => {
    const { templateData, tooltipToggle } = this.props;
    const { isNewUser, themeId } = templateData
    // 如果是isNewUser为false 或者 没做操作 就不进
    if (isNewUser || !window.__IS__START__REFRESH__) {
      tooltipToggle()
    } else {
      get('/business/store_themes/getPreviewUrl', { themeId })
        .then((resp) => {
          window.open(resp.url || 'https://influmonster.com/', '_blank')
        })
        .catch((err) => {
          console.error(err);
          window.open(err.error || 'https://influmonster.com/', '_blank')
        });
    }
  }

  cancelModal = () => {
    this.setState({
      isWho: '',
    })
  }

  render() {
    const { templateData, history } = this.props;
    const { isWho } = this.state;
    const { themeId } = templateData;
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
              ? (
                <RevertContainer
                  history={history}
                  template={templateData}
                  cancel={this.cancelModal}
                />
              )
              : null
        }
      </div>
    )
  }
}

ListBtn.wrappedComponent.propTypes = {
  history: PropTypes.object.isRequired,
  tooltipToggle: PropTypes.func.isRequired,
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};

export default ListBtn
