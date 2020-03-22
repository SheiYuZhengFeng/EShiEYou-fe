import { CourseAction } from "../actions/CourseAction"
import { CourseBrief } from "../services/GeneralAPI";

export interface CourseState {
  allcourse: CourseBrief[],
  mycourse: CourseBrief[],
  course: {
    cid: number,
    name: string,
    vid: number,
    vname: string,
  } | undefined,
}

const initialState : CourseState = {
  allcourse: [],
  mycourse: [],
  course: undefined,
}

const CourseReducer = (state = initialState, action: Action) : CourseState => {
  switch(action.type) {
    case CourseAction.ALLCOURSE:
      return {...state, allcourse: action.payload as CourseBrief[]};
    case CourseAction.MYCOURSE:
      return {...state, mycourse: action.payload as CourseBrief[]};
    case CourseAction.CLEARMYCOURSE:
      return {...state, mycourse: []};
    case CourseAction.RAISEORDER:
      return {...state, course: action.payload as {cid: number, name: string, vid: number, vname: string}};
    case CourseAction.CLEARORDER:
      return {...state, course: undefined};
    default:
      return state;
  }
}

export default CourseReducer;
