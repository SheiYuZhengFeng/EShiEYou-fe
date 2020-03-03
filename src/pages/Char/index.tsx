import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";

class Char extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        教学特色
      </div>
    );
  }
}

export default Char;
