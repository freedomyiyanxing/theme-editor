import React from 'react';

import classes from './preview-header.less';

export default class PreviewHeader extends React.Component {
  render() {
    return (
      <header className={classes.container}>
        <div className={classes.wrapper}>
          <span className={classes.text}>Home Page</span>
        </div>
      </header>
    )
  }
}
