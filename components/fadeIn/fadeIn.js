import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';

const duration = 150;

const defaultStyle = {
  transition: `${duration}ms ease-in`,
  transitionProperty: 'opacity, transform',
  opacity: 0,
};

const transitionStyles = {
  // Start with component invisible and shifted up by 10%
  entering: {
    opacity: 0,
  },
  // Transition to component being visible and having its position reset.
  entered: {
    opacity: 1,
  },
  // Fade element out and slide it back up on exit.
  exiting: {
    opacity: 0,
    transform: 'translateY(10%)',
  },
};

class FadeIn extends Component {
  render() {
    const { in: inProp, children } = this.props;
    return (
      <Transition
        in={inProp}
        timeout={{
          enter: 0,
          exit: duration,
        }}
      >
        {state => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {children}
          </div>
        )}
      </Transition>
    );
  }
}

FadeIn.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FadeIn;
