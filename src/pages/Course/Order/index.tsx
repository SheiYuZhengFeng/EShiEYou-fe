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

class OrderCourse extends React.Component<{cid: number} & RouteComponentProps, {cid: number, name: string, teacher: CourseTeacher[]}> {
  constructor(props: any) {
    super(props);
    if (!store.getState().CourseReducer.course || store.getState().CourseReducer.course?.cid !== this.props.cid) {
      message.warning("请从我的课程页面进入预约！");
      this.props.history.goBack();
    }
    this.state = {...(store.getState().CourseReducer.course as {cid: number, name: string}), teacher: []};
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
    if (!form.starttime || !form.endtime || form.endtime < form.starttime + 3600 || form.starttime <= new Date().getTime() / 1000) {
      message.error("请选择正确的预约时间，且时长至少为一小时！");
      return;
    }
    if (form.teacher === -1 || form.teacher >= this.state.teacher.length) {
      message.error("请选择中教！");
      return;
    }
    form.starttime = Math.round(form.starttime / 3600) * 3600;
    form.endtime = Math.round(form.endtime / 3600) * 3600;
    const onOk = () => {
      StudentAPI.order.add({cid: this.state.cid, teacher: this.state.teacher[form.teacher].id, starttime: form.starttime, endtime: form.endtime}).then(res => {
        if (res.code === 0) {
          message.success("预约成功，不要忘记上课哦！");
          this.props.history.push("/order");
        }
        else {
          message.error("预约失败！");
        }
      });
    }
    Modal.confirm({
      title: "即将预约",
      content: "确认要在【" + new Date(form.starttime * 1000).toLocaleString() + "~" + new Date(form.endtime * 1000).toLocaleString() + "】时段，预约“" + this.state.teacher[form.teacher].username + "”中教为你上“" + this.state.name +"”课吗？",
      okText: "确认预约",
      cancelText: "取消",
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
          message.error("拉取可预约中教列表失败！");
          this.props.history.goBack();
        }
      });
      return <div className={styles.whole}><Spin size="large" /></div>;
    }
    return (
      <div className={styles.whole}>
        <div className={styles.info}>
          <div className={styles.name}>课程：{this.state.name}</div>
          <div className={styles.time}>预约开始时间：<Datetime onChange={this.handleTime.bind(this, "starttime")} /></div>
          <div className={styles.time}>预约结束时间：<Datetime onChange={this.handleTime.bind(this, "endtime")} /></div>
          <Collapse key="collapse" bordered={false} className={styles.teachers} accordion onChange={this.handleCollapse}>
            {this.state.teacher.map((v, i) => (
              <Collapse.Panel key={i} header={v.username} className={styles.teacher}>
                <UserDescriptions title="" information={{sex: v.sex, age: v.age, content: v.content, qualification: v.qualification, background: v.background, time: v.time}}></UserDescriptions>
              </Collapse.Panel>
            ))}
          </Collapse>
          <Button className={styles.submit} type="primary" onClick={this.handleSubmit}>预约</Button>
        </div>
      </div>
    );
  }
}

export default withRouter(OrderCourse);
