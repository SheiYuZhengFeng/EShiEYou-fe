import React from "react";
import styles from "./index.module.less";
import GeneralAPI, { CourseBrief } from "../../../services/GeneralAPI";
import { message, Skeleton, Tag, Button } from "antd";
import { CONST } from "../../../components/UserDescriptions";
import store from "../../../store";
import { allCourseAction } from "../../../actions/CourseAction";
import { RouteComponentProps, withRouter } from "react-router";
import QueueAnim from "rc-queue-anim";

class AllCourse extends React.Component<RouteComponentProps & {buy: boolean}, {courses: CourseBrief[]}> {
  constructor(props: any) {
    super(props);
    this.state = {courses: store.getState().CourseReducer.allcourse};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, courses: store.getState().CourseReducer.allcourse});
  })
  updateList = () => {
    GeneralAPI.course.getList().then(res => {
      if (res.code === 0) {
        allCourseAction(res.data.courses);
      }
      else {
        message.error("拉取课程列表失败");
      }
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
    if (Object.keys(state.courses).length === 0) {
      this.updateList();
      return <div className={styles.whole}><Skeleton className={styles.skeleton} active /></div>;
    }
    return (
      <QueueAnim className={styles.whole} animConfig={[{opacity: [1, 0], translateY: [0, 10]}, {opacity: [1, 0], translateY: [0, -10]}]}>
        <div key="courses" className={styles.courses}>
          {state.courses.map((v, i) => 
            <div key={i} className={styles.course} onClick={this.toDetail.bind(this, v.cid)}>
              <div className={styles.name + " " + styles.hidden}><Tag color={CONST.color[v.category]}>{CONST.language[v.category]}</Tag>{v.name}</div>
              <div className={styles.time}>{new Date(v.starttime * 1000).toLocaleString()}</div>
              <div className={styles.content}>{v.content.length > 100 ? (v.content.substr(0, 100) + "...") : v.content}</div>
              <div className={styles.bottom}>
                <div className={styles.buttons}>
                  {this.props.buy ? <Button size={"small"} type="primary" onClick={this.toBuy.bind(this, v.cid)}>购买</Button> : null}
                  <Button size={"small"}>查看详细</Button>
                </div>
                <div className={styles.price}>
                  {v.discount > 0 ? <div className={styles.former}>{v.cost}</div> : null}
                  <div className={styles.now}>
                    {v.discount > 0 ? (v.cost * (100 - v.discount) / 100).toFixed(0) : v.cost}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </QueueAnim>
    );
  }
}

export default withRouter(AllCourse);
