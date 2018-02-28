import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classnames from 'classnames';
import anime from 'animejs';
// Styles
import s from './menu.css';

class Menu extends Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.open) {
      this.animateNavLinks();
    }
  }

  animateNavLinks() {
    const tl = anime.timeline({
      targets: this.ul.children,
      duration: 600,
      easing: 'easeOutQuint',
      delay: (t, i) => i * 100 + 100,
    });

    tl
      .add({
        translateX: '-100%',
        opacity: {
          value: 0,
        },
        duration: 0,
      })
      .add({
        translateX: '0%',
        opacity: {
          value: 1,
          duration: 700,
        },
        delay: (t, i) => i * 100 + 100,
      });
  }

  render() {
    const { open, t } = this.props;

    return (
      <div className={classnames(s.container, open ? s.open : '')}>
        <div className={s.dropdown}>
          <ul ref={c => (this.ul = c)}>
            <li>
              <a>{t.newGame}</a>
            </li>
            <li>
              <a>{t.restartGame}</a>
            </li>
            <li>
              <a>{t.topScore}</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

Menu.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default Menu;
