import React from 'react';
import PropTypes from 'prop-types';
import classes from './section.less';

const Section = (props) => {
  const { children } = props;
  return (
    (
      <section className={classes.container}>
        <div className={classes.content}>
          { children }
        </div>
      </section>
    )
  )
}

Section.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Section
