import React from "react";
import { Route } from "react-router-dom";

import Main from '../pages/Main';
import User from "../pages/User";
import Course from "../pages/Course";
import Order from "../pages/Order";
import Mail from "../pages/Mail";
import Char from "../pages/Char";
import About from "../pages/About";

export default <>
  <Route component={ Main } exact path="/" />
  <Route component={ Course } exact path="/course" />
  <Route component={ Course } exact path="/course/:cid" />
  <Route component={ Course } exact path="/course/:cid/buy" />
  <Route component={ Course } exact path="/mycourse" />
  <Route component={ Course } exact path="/mycourse/:cid" />
  <Route component={ Course } exact path="/mycourse/:cid/order" />
  <Route component={ Order } exact path="/order" />
  <Route component={ Mail } exact path="/mail" />
  <Route component={ User } exact path="/user" />
  <Route component={ Char } exact path="/char" />
  <Route component={ About } exact path="/about" />
</>;
