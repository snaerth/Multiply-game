import axios from 'axios';
import { SET_LANG, TOGGLE_MENU } from './types';

/**
 * Gets global language for application
 *
 * @param {Object} str - Language key
 */
export function setTranslations(lang = 'is', translations = null) {
  return dispatch => {
    const payload = {
      lang,
      translations: translations || null,
    };

    dispatch({ type: SET_LANG, payload });
  };
}

/**
 * Gets global language for application
 *
 * @param {String} lang - Language key
 */
export function getTranslations(lang = 'is') {
  return async dispatch => {
    try {
      // Get translation JSON file from static folder
      const response = await axios.get(`/static/lang/${lang}.json`);
      const payload = {
        lang,
        translations: response.data,
      };

      dispatch({ type: SET_LANG, payload });
    } catch (error) {
      return new Error(error);
    }
  };
}

/**
 * Toggles navigation menu
 *
 * @param {Boolean} menuOpen - State of navigatin menu
 */
export function toggleMenu(menuOpen) {
  return { type: TOGGLE_MENU, payload: menuOpen };
}
