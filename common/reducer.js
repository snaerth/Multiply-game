import { SET_LANG, TOGGLE_MENU } from './types';

const initialState = {
  avaliableLang: ['is', 'en'],
  lang: 'is',
  translations: null,
  menuOpen: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_LANG:
      return {
        ...state,
        lang: action.payload.lang,
        translations: action.payload.translations,
      };

    case TOGGLE_MENU:
      return {
        ...state,
        menuOpen: action.payload,
      };

    default:
      return { ...state };
  }
}
