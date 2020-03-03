import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import { RouteComponentProps } from "react-router";
import AllCourse from "./All";
import MyCourse from "./My";

class Course extends React.Component<RouteComponentProps, {type: number}> {
  constructor(props: any) {
    super(props);
    this.state = {type: (this.props.location.pathname === "/course" ? 0 : 1)};
  }
  render() {
    return Combiner(
      <div className={styles.container}>
        {this.state.type === 0 ? <AllCourse /> : <MyCourse />}
      </div>
    );
  }
}

export default Course;
