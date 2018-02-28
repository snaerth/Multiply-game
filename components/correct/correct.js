import React, { Component } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import s from './correct.css';

class Correct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tl: null,
    };
  }

  componentDidMount() {
    const timeline = anime.timeline({ direction: 'alternate', autoPlay: false });
    const sprinkle = this.container.children[0].className;
    const circle = this.container.children[0].children[0].className;

    timeline
      .add({
        targets: `.${sprinkle}`,
        opacity: {
          value: [0, 1],
          duration: 150,
          delay: 0,
        },
        offset: 0,
      })
      .add({
        targets: `.${circle}`,
        height: {
          value: [5, 12],
          duration: 100,
          delay: 100,
          easing: 'easeOutQuad',
        },
        offset: 0,
      })
      .add({
        targets: `.${circle}`,
        height: {
          value: [12, 5],
          duration: 100,
          delay: 200,
          easing: 'easeOutQuad',
        },
        offset: 0,
      })
      .add({
        targets: `.${circle}`,
        opacity: {
          value: [1, 0],
          duration: 500,
          delay: 300,
          easing: 'easeOutQuad',
        },
        offset: 0,
      })
      .add({
        targets: `.${circle}`,
        translateY: {
          value: [0, -28],
          duration: 500,
          delay: 400,
          easing: 'easeOutQuad',
        },
        offset: 0,
      });

    this.setState({
      tl: timeline,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { animate } = this.props;
    if (animate) {
      console.log(this.state.tl);
      this.state.tl.play();
    }
  }

  render() {
    return (
      <div
        className={s.container}
        ref={instance => {
          this.container = instance;
        }}
      >
        <div className={s.sprinkle}>
          <div className={s.circle} />
        </div>
        <div className={s.sprinkle}>
          <div className={s.circle} />
        </div>
        <div className={s.sprinkle}>
          <div className={s.circle} />
        </div>
        <div className={s.sprinkle}>
          <div className={s.circle} />
        </div>
        <div className={s.sprinkle}>
          <div className={s.circle} />
        </div>
      </div>
    );
  }
}

Correct.propTypes = {
  animate: PropTypes.bool.isRequired,
};

export default Correct;
