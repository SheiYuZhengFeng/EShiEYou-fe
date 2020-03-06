import React from "react";
import styles from "./index.module.less";
import GeneralAPI, { CourseDetail, Video, VideoTitle, ForeignBrief, ForeignDetail } from "../../../services/GeneralAPI";
import { Spin, Empty, Tag, Collapse, Rate } from "antd";
import UserDescriptions, { CONST } from "../../../components/UserDescriptions";
import QueueAnim from "rc-queue-anim";

export interface DetailCourseConfig {
  cid: number,
  buy: boolean,
  buying: boolean,
  detailed: boolean,
}

class DetailCourse extends React.Component<{config: DetailCourseConfig}, {status: number, data?: CourseDetail, video?: Video[] | VideoTitle[], foreign?: ForeignBrief | ForeignDetail}> {
  constructor(props: any) {
    super(props);
    this.state = {status: 3};
    const { cid } = this.props.config;
    GeneralAPI.course.getDetail({id: cid}).then(res => { // 获取课程详细
      if (res.code === 0) { this.setState((state) => {return {status: state.status - 1, data: res.data};}); return res.data.teacher; } // 抛出外教 id
      else this.setState({status: -1});
    }).then((id: number) => {
      const getForeign = this.props.config.detailed ? GeneralAPI.user.getForeignDetail : GeneralAPI.user.getForeignBrief;
      getForeign({id}).then(res => { // 获取外教信息
        if (res.code === 0) this.setState((state) => {return {status: state.status - 1, foreign: res.data};});
        else this.setState({status: -1});
      });
    });
    const getVideo = this.props.config.detailed ? GeneralAPI.course.getVideo : GeneralAPI.course.getVideoTitle;
    getVideo({id: cid}).then(res => { // 获取视频信息
      if (res.code === 0) this.setState((state) => {return {status: state.status - 1, video: res.data.videos};});
      else this.setState({status: -1});
    });
  }
  render() {
    let component: JSX.Element;
    if (this.state.status > 0) component = <Spin size="large" />;
    else if (this.state.status < 0) component = <Empty description="没有找到这门课程" />;
    else {
      const data = this.state.data as CourseDetail;
      component = (
        <QueueAnim className={styles.detail}>
          <div key="name" className={styles.name}><Tag className={styles.tag} color={CONST.color[data.category]}>{CONST.language[data.category]}</Tag>{data.name}</div>
          <div key="time" className={styles.time}>开课时间：{new Date(data.starttime * 1000).toLocaleString()}</div>
          <div key="score" className={styles.score}><Rate disabled value={Math.round(data.score / 100 * 10) / 2} allowHalf /></div>
          <div key="content" className={styles.content}>{data.content}</div>
          <Collapse key="collapse" bordered={false}>
            <Collapse.Panel key="1" header="外教信息" className={styles.panel}>
              <UserDescriptions className={styles.teacher} title="" information={this.state.foreign}></UserDescriptions>
            </Collapse.Panel>
          </Collapse>
        </QueueAnim>
      );
    }
    return <div className={styles.whole}>{component}</div>;
  }
}

export default DetailCourse;
