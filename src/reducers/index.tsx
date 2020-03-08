import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import CourseReducer from "./CourseReducer";
import OrderReducer from "./OrderReduer";

const RootReducer = combineReducers({
  UserReducer: UserReducer,
  CourseReducer: CourseReducer,
  OrderReducer: OrderReducer,
});

export default RootReducer;
