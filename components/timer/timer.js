import React, { Component } from 'react';
import s from './timer.css';

const formattedSeconds = sec => `${Math.floor(sec / 60)}:${`0${sec % 60}`.slice(-2)}`;

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsElapsed: 0,
      laps: [],
      lastClearedIncrementer: null,
    };
    this.incrementer = null;
  }

  start() {
    this.incrementer = setInterval(() => {
      this.setState({
        secondsElapsed: this.state.secondsElapsed + 1,
      });
    }, 1000);
  }

  stop() {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer,
    });
  }

  reset() {
    clearInterval(this.incrementer);
    this.setState({
      secondsElapsed: 0,
      laps: [],
    });
  }

  newLab() {
    const { secondsElapsed, laps } = this.state;

    this.setState({
      laps: laps.concat([secondsElapsed]),
    });
  }

  render() {
    const { secondsElapsed } = this.state;
    return <span className={s.container}>{formattedSeconds(secondsElapsed)}</span>;
  }
}

export default Timer;
