import { CourseBrief } from "../services/GeneralAPI"
import store from "../store"

export const CourseAction = {
  ALLCOURSE: "ALLCOURSE",
  MYCOURSE: "MYCOURSE",
}

export const allCourseAction = (payload: CourseBrief[]) => {
  store.dispatch({ type: CourseAction.ALLCOURSE, payload: payload });
}

export const myCourseAction = (payload: CourseBrief[]) => {
  store.dispatch({ type: CourseAction.MYCOURSE, payload: payload });
}
