import React from "react";
import styles from "../All/index.module.less";
import { CourseBrief } from "../../../services/GeneralAPI";
import { message, Skeleton, Tag, Button } from "antd";
import { CONST } from "../../../components/UserDescriptions";
import store from "../../../store";
import { myCourseAction } from "../../../actions/CourseAction";
import { RouteComponentProps, withRouter } from "react-router";
import QueueAnim from "rc-queue-anim";
import StudentAPI from "../../../services/StudentAPI";
import NativeAPI from "../../../services/NativeAPI";
import ForeignAPI from "../../../services/ForeignAPI";

class MyCourse extends React.Component<RouteComponentProps, {courses: CourseBrief[]}> {
  constructor(props: any) {
    super(props);
    this.state = {courses: store.getState().CourseReducer.mycourse};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, courses: store.getState().CourseReducer.mycourse});
  })
  updateList = () => {
    if (!store.getState().UserReducer.loged) return;
    let getList = StudentAPI.course.my;
    switch (store.getState().UserReducer.session.category) {
      case 1: getList = NativeAPI.course.list; break;
      case 2: getList = ForeignAPI.course.my; break;
    }
    getList().then(res => {
      if (res.code === 0) {
        myCourseAction(res.data.courses as CourseBrief[]);
      }
      else {
        message.error("拉取课程列表失败");
      }
    });
  }
  toDetail = (id: number) => {
    this.props.history.push("/mycourse/" + id);
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
              {(v as any).createtime ? <div className={styles.time}>创建时间：{new Date((v as any).createtime * 1000).toLocaleString()}</div> : null}
              <div className={styles.time}>开课时间：{new Date(v.starttime * 1000).toLocaleString()}</div>
              <div className={styles.time}>结课时间：{new Date((v as any).endtime * 1000).toLocaleString()}</div>
              <div className={styles.bottom}>
                <div className={styles.buttons}>
                  <Button size={"small"}>查看详细</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </QueueAnim>
    );
  }
}

export default withRouter(MyCourse);
