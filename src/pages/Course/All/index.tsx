import React from "react";
import styles from "./index.module.less";
import GeneralAPI, { CourseBrief } from "../../../services/GeneralAPI";
import { message, Skeleton, Tag, Button } from "antd";
import { CONST } from "../../../components/UserDescriptions";
import store from "../../../store";
import { allCourseAction } from "../../../actions/CourseAction";

const COLOR = ["orange", "green"];

class AllCourse extends React.Component<{buy: boolean}, {courses: CourseBrief[]}> {
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
  render() {
    const { state } = this;
    if (Object.keys(state.courses).length === 0) {
      this.updateList();
      return <div className={styles.whole}><Skeleton className={styles.skeleton} active /></div>;
    }
    return (
      <div className={styles.whole}>
        <div className={styles.courses}>
          {state.courses.map((v, i) => 
            <div className={styles.course}>
              <div className={styles.name + " " + styles.hidden}><Tag color={COLOR[v.category]}>{CONST.language[v.category]}</Tag>{v.name}</div>
              <div className={styles.time}>{new Date(v.starttime * 1000).toLocaleString()}</div>
              <div className={styles.content}>{v.content.length > 100 ? (v.content.substr(0, 100) + "...") : v.content}</div>
              <div className={styles.bottom}>
                <div className={styles.buttons}>
                  {this.props.buy ? <Button size={"small"} type="primary">购买</Button> : null}
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
      </div>
    );
  }
}

export default AllCourse;
