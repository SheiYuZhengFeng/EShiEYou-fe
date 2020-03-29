import store from "../store"

export const LocaleActionType = {
  SWITCHLOCALE: "SWITCHLOCALE",
}

export const switchLocaleAction = (locale: string) => {
  store.dispatch({ type: LocaleActionType.SWITCHLOCALE, payload: locale });
}
