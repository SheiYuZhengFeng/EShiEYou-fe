import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import { RouteComponentProps } from "react-router";
import AllCourse from "./All";
import MyCourse from "./My";
import store from "../../store";
import DetailCourse, { DetailCourseConfig } from "./Detail";

class Course extends React.Component<RouteComponentProps<{cid: string}>, {type: number, config?: DetailCourseConfig}> {
  constructor(props: any) {
    super(props);
    if (this.props.location.pathname === "/course") this.state = {type: 0};
    else if (this.props.location.pathname === "/mycourse") this.state = {type: 1};
    else {
      const cid = parseInt(this.props.match.params.cid);
      const buying = this.props.location.pathname.endsWith("/buy");
      this.state = {type: 2, config: {cid, buying, detailed: false}}
    }
  }
  render() {
    let component: JSX.Element;
    if (this.state.type === 0) component = <AllCourse buy={store.getState().UserReducer.session.category === 0} />;
    else if (this.state.type === 1) component = <MyCourse />;
    else component = <DetailCourse config={this.state.config as DetailCourseConfig} />
    return Combiner(
      <div className={styles.container}>
        {component}
      </div>
    );
  }
}

export default Course;
