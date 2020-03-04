import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";
import { RouteComponentProps } from "react-router";
import AllCourse from "./All";
import MyCourse from "./My";
import store from "../../store";

class Course extends React.Component<RouteComponentProps, {type: number}> {
  constructor(props: any) {
    super(props);
    this.state = {type: (this.props.location.pathname === "/course" ? 0 : 1)};
  }
  render() {
    return Combiner(
      <div className={styles.container}>
        {this.state.type === 0 ? <AllCourse buy={store.getState().UserReducer.session.category === 0} /> : <MyCourse />}
      </div>
    );
  }
}

export default Course;
