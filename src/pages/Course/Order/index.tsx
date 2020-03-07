import React from "react";
import styles from "./index.module.less";
import store from "../../../store";
import { message } from "antd";
import { RouteComponentProps, withRouter } from "react-router";
import { clearOrderAction } from "../../../actions/CourseAction";

class OrderCourse extends React.Component<{cid: number} & RouteComponentProps, {cid: number, name: string}> {
  constructor(props: any) {
    super(props);
    if (!store.getState().CourseReducer.course || store.getState().CourseReducer.course?.cid !== this.props.cid) {
      message.warning("请从我的课程页面进入预约！");
      this.props.history.goBack();
    }
    this.state = {...(store.getState().CourseReducer.course as {cid: number, name: string})};
    clearOrderAction();
  }
  render() {
    return (
      <div></div>
    );
  }
}

export default withRouter(OrderCourse);
