import { CourseBrief } from "../services/GeneralAPI"
import store from "../store"

export const CourseAction = {
  ALLCOURSE: "ALLCOURSE",
  MYCOURSE: "MYCOURSE",
  CLEARMYCOURSE: "CLEARMYCOURSE",
  RAISEORDER: "RAISEORDER",
  CLEARORDER: "CLEARORDER",
}

export const allCourseAction = (payload: CourseBrief[]) => {
  store.dispatch({ type: CourseAction.ALLCOURSE, payload: payload });
}

export const myCourseAction = (payload: CourseBrief[]) => {
  store.dispatch({ type: CourseAction.MYCOURSE, payload: payload });
}

export const clearMyCourseAction = () => {
  store.dispatch({ type: CourseAction.CLEARMYCOURSE});
}

export const raiseOrderAction = (payload: {cid: number, name: string, vid: number, vname: string}) => {
  store.dispatch({ type: CourseAction.RAISEORDER, payload: payload });
}

export const clearOrderAction = () => {
  store.dispatch({ type: CourseAction.CLEARORDER });
}
