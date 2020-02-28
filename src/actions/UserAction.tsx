import store from "../store"

export const UserActionType = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  TOLOGIN: "TOLOGIN",
  TOREGISER: "TOREGISTER",
}

export const LoginAction = (payload: {name: string, token: string}) => {
  store.dispatch({ type: UserActionType.LOGIN, payload: payload });
}

export const LogoutAction = () => {
  store.dispatch({ type: UserActionType.LOGOUT });
}

export const toLoginAction = () => {
  store.dispatch({ type: UserActionType.TOLOGIN });
}

export const toRegisterAction = () => {
  store.dispatch({ type: UserActionType.TOREGISER });
}
