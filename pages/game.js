import React, { Component } from 'react';
import Head from 'next/head';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper';
import { setTranslations } from '../common/actions';
import { SET_LANG } from '../common/types';
import configureStore from '../common/store';
import Navigation from '../components/navigation';
import Slider from '../components/slider';
import Menu from '../components/menu';
import Multiply from '../components/multiply';
import Section from '../components/section';
import 'isomorphic-unfetch';

class Index extends Component {
  static async getInitialProps({ req, store }) {
    const lang = req && req.cookies && req.cookies.lang ? req.cookies.lang : 'is';
    const res = await fetch(`${process.env.LOCAL_URL}/static/lang/${lang}.json`);
    const json = await res.json();
    const payload = {
      lang,
      translations: json,
    };

    store.dispatch({ type: SET_LANG, payload });
    return { t: json, lang };
  }

  render() {
    const { t, lang, menuOpen } = this.props;

    return (
      <div>
        <Head>
          <title>{t.gameName}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="stylesheet" href="/static/css/bulma.min.css" />
          <link rel="stylesheet" href="/static/css/base.css" />
          <link rel="stylesheet" href="/static/css/style.css" />
        </Head>
        <main>
          <Navigation t={t} lang={lang} />
          <Menu open={menuOpen} t={t} />
          <Multiply />
        </main>
      </div>
    );
  }
}

/**
 * Maps redux state to props
 *
 * @param {Object} state
 */
function mapStateToProps(state) {
  const { translations, lang, menuOpen } = state.common;
  return {
    t: translations,
    lang,
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
    setTranslations: bindActionCreators(setTranslations, dispatch),
  };
}

export default withRedux(configureStore, mapStateToProps, mapDispatchToProps)(Index);
