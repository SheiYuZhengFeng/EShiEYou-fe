import store from "../store"
import { clearMyCourseAction } from "./CourseAction";

export const UserActionType = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  TOLOGIN: "TOLOGIN",
  TOREGISER: "TOREGISTER",
  INFORMATION: "INFORMATION",
}

export const LoginAction = (payload: {name: string, token: string, category: number}) => {
  store.dispatch({ type: UserActionType.LOGIN, payload: payload });
}

export const LogoutAction = () => {
  store.dispatch({ type: UserActionType.LOGOUT });
  clearMyCourseAction();
}

export const toLoginAction = () => {
  store.dispatch({ type: UserActionType.TOLOGIN });
}

export const toRegisterAction = () => {
  store.dispatch({ type: UserActionType.TOREGISER });
}

export const informationAction = (payload: any) => {
  store.dispatch({ type: UserActionType.INFORMATION, payload: payload });
}
