import React from "react";
import styles from "./index.module.less";
import store from "../../../store";
import { message, Spin, Collapse, Button, Modal } from "antd";
import { RouteComponentProps, withRouter } from "react-router";
import { clearOrderAction } from "../../../actions/CourseAction";
import StudentAPI, { CourseTeacher } from "../../../services/StudentAPI";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import UserDescriptions from "../../../components/UserDescriptions";
import { getCurrentUnix, unixToString } from "../../../utils/datetime";
import intl from "react-intl-universal";

class OrderCourse extends React.Component<{cid: number} & RouteComponentProps, {cid: number, name: string, vid: number, vname: string, teacher: CourseTeacher[]}> {
  constructor(props: any) {
    super(props);
    if (!store.getState().CourseReducer.course || store.getState().CourseReducer.course?.cid !== this.props.cid) {
      message.warning(intl.get("order_from_my_course_message"));
      this.props.history.goBack();
    }
    this.state = {...(store.getState().CourseReducer.course as {cid: number, name: string, vid: number, vname: string}), teacher: []};
    clearOrderAction();
  }
  form = {
    starttime: 0,
    endtime: 0,
    teacher: -1,
  }
  handleTime = (key: string, value: moment.Moment | string) => {
    if (!(key in this.form)) return;
    if (typeof(value) === "string") this.form[key as ("starttime" | "endtime")] = 0;
    else this.form[key as ("starttime" | "endtime")] = value.unix();
  }
  handleCollapse = (key: any) => {
    this.form.teacher = key;
  }
  handleSubmit = () => {
    const { form } = this;
    if (!form.starttime || !form.endtime || form.starttime <= getCurrentUnix() + 6 * 3600) {
      message.error(intl.get("order_time_choose"));
      return;
    }
    form.starttime = Math.round(form.starttime / 3600) * 3600;
    form.endtime = Math.round(form.endtime / 3600) * 3600;
    if (form.endtime < form.starttime + 3600) {
      message.error(intl.get("order_time_longer"));
      return;
    }
    if (form.teacher === -1 || form.teacher >= this.state.teacher.length) {
      message.error(intl.get("order_choose_native"));
      return;
    }
    const onOk = () => {
      StudentAPI.order.add({cid: this.state.cid, vid: this.state.vid, teacher: this.state.teacher[form.teacher].id, starttime: form.starttime, endtime: form.endtime}).then(res => {
        if (res.code === 0) {
          message.success(intl.get("order_success"));
          this.props.history.push("/order");
        }
        else {
          message.error(intl.get("order_fail"));
        }
      });
    }
    Modal.confirm({
      title: intl.get("ordering"),
      content: intl.get("ordering_message", {start: unixToString(form.starttime), end: unixToString(form.endtime), teacher: this.state.teacher[form.teacher].username, course: this.state.name, video: this.state.vname}),
      okText: intl.get("confirm_order"),
      cancelText: intl.get("cancel"),
      onOk,
    });
  }
  render() {
    if (this.state.teacher.length === 0) {
      StudentAPI.course.teacher({cid: this.props.cid}).then(res => {
        if (res.code === 0) {
          this.setState({...this.state, teacher: res.data.teachers});
        }
        else {
          message.error(intl.get("fetch_error"));
          this.props.history.goBack();
        }
      });
      return <div className={styles.whole}><Spin size="large" /></div>;
    }
    return (
      <div className={styles.whole}>
        <div className={styles.info}>
          <div className={styles.name}>{intl.get("course_name")}：{this.state.name}</div>
          <div className={styles.name}>{intl.get("video_name")}：{this.state.vname}</div>
          <div className={styles.time}>{intl.get("order_start_time")}：<Datetime onChange={this.handleTime.bind(this, "starttime")} /></div>
          <div className={styles.time}>{intl.get("order_end_time")}：<Datetime onChange={this.handleTime.bind(this, "endtime")} /></div>
          <div className={styles.time}>{intl.get("order_time_message")}</div>
          <Collapse key="collapse" bordered={false} className={styles.teachers} accordion onChange={this.handleCollapse}>
            {this.state.teacher.map((v, i) => (
              <Collapse.Panel key={i} header={v.username} className={styles.teacher}>
                <UserDescriptions title="" information={{sex: v.sex, age: v.age, content: v.content, qualification: v.qualification, background: v.background, time: v.time}}></UserDescriptions>
              </Collapse.Panel>
            ))}
          </Collapse>
          <Button className={styles.submit} type="primary" onClick={this.handleSubmit}>{intl.get("order")}</Button>
        </div>
      </div>
    );
  }
}

export default withRouter(OrderCourse);
