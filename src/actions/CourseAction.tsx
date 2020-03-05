import { CourseBrief } from "../services/GeneralAPI"
import store from "../store"

export const CourseAction = {
  ALLCOURSE: "ALLCOURSE",
}

export const allCourseAction = (payload: CourseBrief[]) => {
  store.dispatch({ type: CourseAction.ALLCOURSE, payload: payload });
}
