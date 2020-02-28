import { UserActionType } from "../actions/UserAction"

const initialState = {
  loged: false,
  view: 0,
  session: {},
}

const UserReducer = (state = initialState, action: Action) => {
  switch(action.type) {
    case UserActionType.LOGIN:
      return {...initialState, loged: true, session: action.payload };
    case UserActionType.LOGOUT:
      return initialState;
    case UserActionType.TOLOGIN:
      return {...initialState, view: 0};
    case UserActionType.TOREGISER:
      return {...initialState, view: 1};
    default:
      return state;
  }
}

export default UserReducer;
