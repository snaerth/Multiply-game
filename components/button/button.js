import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './button.css';

class Button extends Component {
  render() {
    const { children } = this.props;
    return (
      <button className={s.button} {...this.props}>
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;
