import React from "react";
import styles from "../All/index.module.less";
import { CourseBrief } from "../../../services/GeneralAPI";
import { message, Skeleton, Tag, Button, Empty } from "antd";
import { CONST, STUDENT } from "../../../components/UserDescriptions";
import store from "../../../store";
import { myCourseAction } from "../../../actions/CourseAction";
import { RouteComponentProps, withRouter } from "react-router";
import QueueAnim from "rc-queue-anim";
import StudentAPI from "../../../services/StudentAPI";
import NativeAPI from "../../../services/NativeAPI";
import ForeignAPI from "../../../services/ForeignAPI";
import { unixToString } from "../../../utils/datetime";

class MyCourse extends React.Component<RouteComponentProps, {got: boolean, courses: CourseBrief[]}> {
  constructor(props: any) {
    super(props);
    this.state = {got: store.getState().CourseReducer.mycourse.length > 0, courses: store.getState().CourseReducer.mycourse};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, courses: store.getState().CourseReducer.mycourse});
  })
  componentWillMount() {
    this.updateList();
  }
  componentWillUnmount() {
    this.ss();
  }
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
      this.setState({...this.state, got: true});
    });
  }
  toDetail = (id: number) => {
    this.props.history.push("/mycourse/" + id);
  }
  render() {
    const { state } = this;
    if (!this.state.got) {
      return <div className={styles.whole}><Skeleton className={styles.skeleton} active /></div>;
    }
    else if (this.state.courses.length === 0) {
      return <Empty description="暂无课程" />;
    }
    return (
      <QueueAnim className={styles.whole} animConfig={[{opacity: [1, 0], translateY: [0, 10]}, {opacity: [1, 0], translateY: [0, -10]}]}>
        <div key="courses" className={styles.courses}>
          {state.courses.map((v, i) => 
            <div key={i} className={styles.course} onClick={this.toDetail.bind(this, v.cid)}>
              <div className={styles.name + " " + styles.hidden}><Tag color={CONST.color()[v.category]}>{CONST.language()[v.category]}</Tag>{v.name}</div>
              {(v as any).createtime ? <div className={styles.time}>创建时间：{unixToString((v as any).createtime)}</div> : null}
              <div className={styles.time}>开课时间：{unixToString(v.starttime)}</div>
              <div className={styles.time}>结课时间：{unixToString((v as any).endtime)}</div>
              <div className={styles.bottom}>
                <div className={styles.buttons}>
                  {store.getState().UserReducer.session.category === STUDENT ? <Button size={"small"} type="primary">去预约上课</Button> : null}
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
