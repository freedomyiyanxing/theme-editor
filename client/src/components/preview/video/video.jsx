import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
} from 'mobx-react';

import { TemplateData } from '../../../store/index';
import classes from './video.less';

const item = [1, 2, 3, 4, 5];

@inject((stores) => {
  return {
    templateData: stores.templateData,
  }
})

class Video extends React.Component {
  render() {
    const { templateData } = this.props;
    const isMobile = templateData.type === 'Phone';
    return (
      <div className={`${classes.container} ${isMobile ? classes.phone : ''}`}>
        <div className={classes.left}>
          <span className={`icon-video ${classes.icon}`} />
        </div>
        {
          isMobile
            ? null
            : (
              <div className={classes.right}>
                {item.map(v => <span key={v} className={classes.item} />)}
              </div>
            )
        }
      </div>
    )
  }
}
Video.wrappedComponent.propTypes = {
  templateData: PropTypes.instanceOf(TemplateData).isRequired,
};


export default Video
