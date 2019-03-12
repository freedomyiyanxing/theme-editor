import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import classes from './input.less'

const MAX_VALUE_LENGTH = 20;

export default class NameInput extends React.Component {
  constructor(props) {
    super(props);
    const { defaultVal } = this.props;
    this.state = {
      value: defaultVal,
    }
  }

  handleChange = (e) => {
    const { click } = this.props;
    const len = e.target.value.length;
    // name 长度  max 20
    if (len < MAX_VALUE_LENGTH) {
      this.setState({
        value: e.target.value,
      });
      click(e.target.value)
    }
  };

  render() {
    const { value } = this.state;
    return (
      <div className={classes.container}>
        <span className={classes.title}>Title :</span>
        <Input
          onChange={this.handleChange}
          value={value}
          placeholder="title"
        />
      </div>
    )
  }
}

NameInput.propTypes = {
  defaultVal: PropTypes.string,
  click: PropTypes.func.isRequired,
};

NameInput.defaultProps = {
  defaultVal: '',
};
