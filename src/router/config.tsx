import React from "react";
import { Route } from "react-router-dom";

import Main from '../pages/Main';
import User from "../pages/User";
import Course from "../pages/Course";
import Order from "../pages/Order";
import Mail from "../pages/Mail";

export default <>
  <Route component={ Main } exact path="/" />
  <Route component={ Course } exact path="/course" />
  <Route component={ Order } exact path="/order" />
  <Route component={ Mail } exact path="/mail" />
  <Route component={ User } exact path="/user" />
</>;
