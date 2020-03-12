import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import CourseReducer from "./CourseReducer";
import OrderReducer from "./OrderReduer";
import MailReducer from "./MailReducer";

const RootReducer = combineReducers({
  UserReducer: UserReducer,
  CourseReducer: CourseReducer,
  OrderReducer: OrderReducer,
  MailReducer: MailReducer,
});

export default RootReducer;
