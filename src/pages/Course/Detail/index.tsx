import React from "react";
import styles from "./index.module.less";
import GeneralAPI, { CourseDetail, Video, VideoTitle, ForeignBrief, ForeignDetail } from "../../../services/GeneralAPI";
import { Spin, Empty } from "antd";

export interface DetailCourseConfig {
  cid: number,
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
        <div className={styles.detail}>
          
        </div>
      );
    }
    return <div className={styles.whole}>{component}</div>;
  }
}

export default DetailCourse;
