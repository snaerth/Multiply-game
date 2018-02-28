import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import anime from 'animejs';
import Link from 'next/link';
import { bindActionCreators } from 'redux';
import MediaQuery from 'react-responsive';
import { getTranslations, toggleMenu } from '../../common/actions';
import s from './navigation.css';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: null,
    };
    this.changeLang = this.changeLang.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      sections: Array.from(document.querySelectorAll('[class*="section-"]')),
    });
  }

  /**
   * Handles scroll to section animation
   * @param {Object} evt
   */
  clickHandler(evt) {
    evt.preventDefault();
    const { sections } = this.state;
    const id = parseInt(evt.target.getAttribute('data-id'), 10);
    const sectionId = `section-${id}`;
    const section = sections.find(section => section.className.includes(sectionId));

    if (section) {
      const { top } = section.getBoundingClientRect();
      const navHeight = this.navbar.clientHeight;
      const scroll = {
        y: window.pageYOffset,
      };

      anime({
        targets: scroll,
        y: top + window.pageYOffset - navHeight - 90,
        duration: 350,
        easing: 'easeInOutCubic',
        update: () => window.scroll(0, scroll.y),
      });
    }
  }

  /**
   * Gets and changes default language
   *
   * @param {String} lang - Language key
   */
  changeLang(lang) {
    this.props.actions.getTranslations(lang);
  }

  toggleMenu() {
    this.props.actions.toggleMenu(!this.props.menuOpen);
  }

  /**
   * Renders default global language
   */
  renderLang() {
    const { t, lang, avaliableLang } = this.props;

    return avaliableLang.map(item => {
      if (item !== lang) {
        return (
          <a className="navbar-item" key={item} onClick={() => this.changeLang(item)}>
            {item.toUpperCase()}
          </a>
        );
      }
    });
  }

  render() {
    const { t, menuOpen } = this.props;

    return (
      <nav className={s.container}>
        <div className={classnames(s.navbar, 'navbar is-fixed-top')} ref={r => (this.navbar = r)}>
          <div className="container">
            <div className="navbar-brand">
              <Link href="/">
                <a className={classnames(s.navbarBrand, 'navbar-item', 'title is-4')}>
                  {t.gameName}
                </a>
              </Link>
              <MediaQuery query="(max-width: 1023px)">
                <div className={s.menu} onClick={this.toggleMenu}>
                  <img src="/static/img/menu.svg" />
                </div>
              </MediaQuery>
            </div>
            <div className="navbar-menu">
              <div className="navbar-end" onClick={this.clickHandler}>
                <Link href="/game">
                  <a className="navbar-item">{t.newGame}</a>
                </Link>
                <a className="navbar-item" data-id={2}>
                  {t.restartGame}
                </a>
                <a className="navbar-item" data-id={3}>
                  {t.topScores}
                </a>
                {this.renderLang()}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

Navigation.propTypes = {
  t: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

/**
 * Maps redux state to props
 *
 * @param {Object} state
 */
function mapStateToProps(state) {
  const { avaliableLang, menuOpen } = state.common;

  return {
    avaliableLang,
    menuOpen,
  };
}

/**
 * Maps dispatch to props
 *
 * @param {Object} state
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ getTranslations, toggleMenu }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
