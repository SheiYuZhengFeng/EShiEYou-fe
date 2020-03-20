import { combineReducers } from "redux";
import UserReducer from "./UserReducer";
import CourseReducer from "./CourseReducer";
import OrderReducer from "./OrderReduer";
import MailReducer from "./MailReducer";
import BillReducer from "./BillReducer";

const RootReducer = combineReducers({
  UserReducer: UserReducer,
  CourseReducer: CourseReducer,
  OrderReducer: OrderReducer,
  MailReducer: MailReducer,
  BillReducer: BillReducer,
});

export default RootReducer;
