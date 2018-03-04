import React, { Component } from 'react';
import classnames from 'classnames';
import Timer from '../timer';
import Button from '../button';
import FadeIn from '../fadeIn';
import { createMultiplyArr, shuffle } from '../../utils/createMultiplicationTable';
import s from './multiply.css';

class Multiply extends Component {
  constructor(props) {
    super(props);

    this.data = shuffle(createMultiplyArr(10));
    this.resetGame = this.resetGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.startTime = this.startTime.bind(this);
    this.stopTime = this.stopTime.bind(this);
    this.resetTime = this.resetTime.bind(this);
    this.onAnswerChange = this.onAnswerChange.bind(this);

    this.state = {
      data: this.data,
      score: 0,
      max: 3,
      reset: false,
      start: false,
      stop: true,
      currentIndex: 0,
      currentQuestion: this.formatMultiply(this.data[0], true),
      currentAnswer: this.data[0][2],
      value: '',
      correct: false,
      dirty: false,
      startGame: false,
      shake: false,
      gameOver: false,
    };
  }

  componentWillUnmount() {
    if (this.timeoutShakeId) {
      clearTimeout(this.timeoutShakeId);
    }

    if (this.timeoutCorrectId) {
      clearTimeout(this.timeoutCorrectId);
    }
  }

  startGame() {
    this.setState(
      {
        startGame: true,
      },
      () => {
        this.input.focus();
        this.startTime();
      }
    );
  }

  resetGame() {
    this.timer.reset();
  }

  resetTime() {
    this.timer.reset();
  }

  startTime() {
    this.timer.start();
  }

  stopTime() {
    this.timer.stop();
  }

  onAnswerChange(event) {
    const { currentAnswer, currentIndex, data, score, max, gameOver } = this.state;
    const { value } = event.target;
    const next = currentIndex + 1;

    if (next === max) {
      this.setState({
        gameOver: true,
      });
    } else {
      this.setState({ value, currentIndex: next });

      if (currentAnswer.toString().length === value.toString().length) {
        let newState = {
          correct: false,
          currentQuestion: this.formatMultiply(data[next], true),
          currentAnswer: data[next][2],
          shake: true,
        };

        // If correct answer
        if (parseInt(value) === currentAnswer) {
          newState = Object.assign(newState, {
            correct: true,
            score: score + 1,
            shake: false,
          });
        }

        newState = Object.assign(newState, {
          value: '',
        });

        setTimeout(() => {
          this.setState(newState);
        }, 200);

        this.timeoutShakeId = setTimeout(() => {
          this.setState({
            correct: false,
          });
        }, 700);
      }

      // If not correct answer
      if (parseInt(value) !== currentAnswer) {
        this.timeoutShakeId = setTimeout(() => {
          this.setState({
            shake: false,
          });
        }, 1000);
      }
    }
  }

  renderValues() {
    return this.data.map((arr, i) => <div key={i}>{this.formatMultiply(arr, false)}</div>);
  }

  formatMultiply(arr, withOutAnswer) {
    return `${arr[0]} x ${arr[1]} = ${!withOutAnswer ? arr[2] : ''}`;
  }

  render() {
    const { startGame, currentQuestion, value, correct, score, shake, gameOver } = this.state;

    return (
      <div className={s.container}>
        {gameOver || !startGame ? (
          <div>
            {gameOver ? (
              <Button onClick={this.restartGame}>Restart game</Button>
            ) : (
              <Button onClick={this.startGame}>Start game</Button>
            )}
          </div>
        ) : (
          <div className={s.gameContainer}>
            <div className={s.timer}>
              <Timer
                ref={instance => {
                  this.timer = instance;
                }}
              />
            </div>
            <div className={s.score}>{score}</div>
            <div className={classnames(s.input, shake ? s.shake : '')}>
              <span>{currentQuestion}</span>
              <span>
                <input
                  type="number"
                  className={s.gameInput}
                  onChange={this.onAnswerChange}
                  value={value}
                  ref={instance => {
                    this.input = instance;
                  }}
                />
              </span>
            </div>
            <div className={s.text}>
              <div className={s.correct}>
                <FadeIn in={correct}>Correct</FadeIn>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Multiply;
