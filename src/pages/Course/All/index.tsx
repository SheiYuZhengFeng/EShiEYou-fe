import React from "react";
import styles from "./index.module.less";
import GeneralAPI, { CourseBrief } from "../../../services/GeneralAPI";
import { message, Skeleton, Tag, Button, Empty } from "antd";
import { CONST } from "../../../components/UserDescriptions";
import store from "../../../store";
import { allCourseAction } from "../../../actions/CourseAction";
import { RouteComponentProps, withRouter } from "react-router";
import QueueAnim from "rc-queue-anim";
import Price from "../../../components/Price";
import { unixToString } from "../../../utils/datetime";
import intl from "react-intl-universal";

class AllCourse extends React.Component<RouteComponentProps, {got: boolean, courses: CourseBrief[]}> {
  constructor(props: any) {
    super(props);
    this.state = {got: store.getState().CourseReducer.allcourse.length > 0, courses: store.getState().CourseReducer.allcourse};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, courses: store.getState().CourseReducer.allcourse});
  })
  componentWillMount() {
    this.updateList();
  }
  componentWillUnmount() {
    this.ss();
  }
  updateList = () => {
    GeneralAPI.course.getList().then(res => {
      if (res.code === 0) {
        allCourseAction(res.data.courses);
      }
      else {
        message.error(intl.get("fetch_error"));
      }
      this.setState({...this.state, got: true});
    });
  }
  toBuy = (id: number, e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation(); //禁止冒泡
    this.props.history.push("/course/" + id + "/buy");
  }
  toDetail = (id: number) => {
    this.props.history.push("/course/" + id);
  }
  render() {
    const { state } = this;
    if (!this.state.got) {
      return <div className={styles.whole}><Skeleton className={styles.skeleton} active /></div>;
    }
    else if (this.state.courses.length === 0) {
      return <Empty description={intl.get("empty_course")} />;
    }
    return (
      <QueueAnim className={styles.whole} animConfig={[{opacity: [1, 0], translateY: [0, 10]}, {opacity: [1, 0], translateY: [0, -10]}]}>
        <div key="courses" className={styles.courses}>
          {state.courses.map((v, i) => 
            <div key={i} className={styles.course} onClick={this.toDetail.bind(this, v.cid)}>
              <div className={styles.name + " " + styles.hidden}><Tag color={CONST.color()[v.category]}>{CONST.language()[v.category]}</Tag>{v.name}</div>
              <div className={styles.time}>{unixToString(v.starttime)}</div>
              <div className={styles.content}>{v.content.length > 100 ? (v.content.substr(0, 100) + "...") : v.content}</div>
              <div className={styles.bottom}>
                <div className={styles.buttons}>
                  <Button size={"small"} type="primary" onClick={this.toBuy.bind(this, v.cid)}>{intl.get("buy")}</Button>
                  <Button size={"small"}>{intl.get("get_detail")}</Button>
                </div>
                <Price cost={v.cost} discount={v.discount} />
              </div>
            </div>
          )}
        </div>
      </QueueAnim>
    );
  }
}

export default withRouter(AllCourse);
