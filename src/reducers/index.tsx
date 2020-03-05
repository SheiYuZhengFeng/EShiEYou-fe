import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import CourseReducer from "./CourseReducer";

const RootReducer = combineReducers({
  UserReducer: UserReducer,
  CourseReducer: CourseReducer,
});

export default RootReducer;
