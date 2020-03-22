import React from "react";
import styles from "./index.module.less";

class Introduction extends React.Component<{header: string, img: string[], title: string[], desc: string[], className?: string}> {
  render() {
    const { header, img, title, desc, className } = this.props;
    return (
      <div className={styles.whole + " " + (className ? className : "")}>
        <div className={styles.header}>{header}</div>
        <div className={styles.items}>
          {img.map((v, i) => (
            <div key={i} className={styles.item}>
              <img src={v} alt={title[i]} />
              <div className={styles.title}>{title[i]}</div>
              <div className={styles.desc}>{desc[i]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Introduction;
