import { LocaleActionType } from "../actions/LocaleAction";

export interface LocaleState {
  locale: string,
}

const initialState : LocaleState = {
  locale: "zh-CN",
}

const LocaleReducer = (state = initialState, action: Action) : LocaleState => {
  switch(action.type) {
    case LocaleActionType.SWITCHLOCALE:
      return {...state, locale: action.payload as string};
    default:
      return state;
  }
}

export default LocaleReducer;
