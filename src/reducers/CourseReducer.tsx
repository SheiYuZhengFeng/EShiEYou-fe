import { CourseAction } from "../actions/CourseAction"
import { CourseBrief, CourseDetail } from "../services/GeneralAPI";

const initialState : {allcourse: CourseBrief[], mycourse: CourseBrief[], course: CourseDetail | undefined} = {
  allcourse: [],
  mycourse: [],
  course: undefined,
}

const CourseReducer = (state = initialState, action: Action) => {
  switch(action.type) {
    case CourseAction.ALLCOURSE:
      return {...state, allcourse: action.payload as CourseBrief[]};
    case CourseAction.MYCOURSE:
      return {...state, mycourse: action.payload as CourseBrief[]};
    case CourseAction.CLEARMYCOURSE:
      return {...state, mycourse: []};
    case CourseAction.RAISEORDER:
      return {...state, course: action.payload};
    case CourseAction.CLEARORDER:
      return {...state, course: undefined};
    default:
      return state;
  }
}

export default CourseReducer;
