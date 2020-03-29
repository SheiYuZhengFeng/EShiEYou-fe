import store from "../store"
import { switchLocaleAction } from "../actions/LocaleAction";

export const getCurrentLocale = () => {
  return store.getState().LocaleReducer.locale;
}

export const switchLocale = (locale: string) => {
  switchLocaleAction(locale);
  window.location.reload();
}
