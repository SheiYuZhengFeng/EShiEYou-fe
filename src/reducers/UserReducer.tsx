import { UserActionType } from "../actions/UserAction"
import { GeneralUser } from "../components/UserDescriptions";

const initialState : {loged: boolean, view: number, session: {name: string, token: string, category: number}, information: GeneralUser} = {
  loged: false,
  view: 0,
  session: {
    name: "",
    token: "",
    category: 0,
  },
  information: {},
}

const UserReducer = (state = initialState, action: Action) => {
  switch(action.type) {
    case UserActionType.LOGIN:
      return {...initialState, loged: true, session: action.payload as {name: string, token: string, category: number}};
    case UserActionType.LOGOUT:
      return initialState;
    case UserActionType.TOLOGIN:
      return {...initialState, view: 0};
    case UserActionType.TOREGISER:
      return {...initialState, view: 1};
    case UserActionType.INFORMATION:
      return {...state, information: action.payload};
    default:
      return state;
  }
}

export default UserReducer;
