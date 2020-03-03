import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";

class About extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        关于我们
      </div>
    );
  }
}

export default About;
