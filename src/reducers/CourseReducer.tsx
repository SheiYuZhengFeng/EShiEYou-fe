import { CourseAction } from "../actions/CourseAction"
import { CourseBrief } from "../services/GeneralAPI";

const initialState : {allcourse: CourseBrief[], mycourse: CourseBrief[]} = {
  allcourse: [],
  mycourse: [],
}

const CourseReducer = (state = initialState, action: Action) => {
  switch(action.type) {
    case CourseAction.ALLCOURSE:
      return {...state, allcourse: action.payload as CourseBrief[]};
    case CourseAction.MYCOURSE:
      return {...state, mycourse: action.payload as CourseBrief[]};
    default:
      return state;
  }
}

export default CourseReducer;
