import React from "react";
import styles from "./index.module.less";
import Combiner from "../../components/Combiner";

const Values: {img: string, title: string}[] = [
  {
    img: require("../../themes/images/about/zhuanzhu.png"),
    title: "专 注",
  },
  {
    img: require("../../themes/images/about/dingzhi.png"),
    title: "定 制",
  },
  {
    img: require("../../themes/images/about/gongxiang.png"),
    title: "共 享",
  },
];

class About extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        <div className={styles.whole}>
          <div className={styles.values}>
            {Values.map((v, i) => (
              <div key={i} className={styles.value}>
                <img src={v.img} alt={v.title} />
                <div className={styles.title}>{v.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default About;
