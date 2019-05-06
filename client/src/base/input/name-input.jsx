import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import classes from './input.less'

const MAX_VALUE_LENGTH = 18;

export default class NameInput extends React.Component {
  constructor(props) {
    super(props);
    const { defaultVal } = this.props;
    this.state = {
      value: defaultVal,
    }
  }

  // 点击事件
  handleChange = (e) => {
    const { click } = this.props;
    const len = e.target.value.length;
    // name 长度  max 18
    if (len < MAX_VALUE_LENGTH) {
      this.setState({
        value: e.target.value,
      });
      click(e.target.value)
    }
  };

  // 失去焦点时触发
  handleBlur = (e) => {
    const { defaultVal, click } = this.props;
    const len = e.target.value.length;
    if (len <= 0) {
      this.setState({
        value: defaultVal,
      });
      click(defaultVal)
      console.log(len, '失去焦点时...', defaultVal)
    }
  }

  render() {
    const { value } = this.state;
    return (
      <div className={classes.container}>
        <span className={classes.title}>Title :</span>
        <Input
          onChange={this.handleChange}
          onBlur={this.handleBlur}
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
