import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import { RouteComponentProps } from "react-router";
import AllCourse from "./All";
import MyCourse from "./My";
import DetailCourse, { DetailCourseConfig } from "./Detail";
import OrderCourse from "./Order";

class Course extends React.Component<RouteComponentProps<{cid: string, vid?: string}>, {type: number, config?: DetailCourseConfig}> {
  constructor(props: any) {
    super(props);
    if (this.props.location.pathname === "/course") this.state = {type: 0};
    else if (this.props.location.pathname === "/mycourse") this.state = {type: 1};
    else if (this.props.location.pathname.endsWith("/order")) this.state = {type: 2};
    else {
      const cid = parseInt(this.props.match.params.cid);
      const vid = this.props.match.params.vid ? parseInt(this.props.match.params.vid) : -1;
      const buying = this.props.location.pathname.endsWith("/buy");
      const isMy = this.props.location.pathname.startsWith("/mycourse");
      this.state = {type: 3, config: {cid, vid, buying, isMy}};
    }
  }
  render() {
    let component: JSX.Element;
    if (this.state.type === 0) component = <AllCourse />;
    else if (this.state.type === 1) component = <MyCourse />;
    else if (this.state.type === 2) component = <OrderCourse cid={parseInt(this.props.match.params.cid)} />;
    else component = <DetailCourse config={this.state.config as DetailCourseConfig} />
    return Combiner(
      <div className={styles.container}>
        {component}
      </div>
    );
  }
}

export default Course;
