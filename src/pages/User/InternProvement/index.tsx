import React from "react";
import styles from './index.module.less';
import Combiner from "../../../components/Combiner";
import Img from "../../../themes/timg.png";
import { NavLink } from "react-router-dom";
import { Button, Icon } from "antd";
import intl from "react-intl-universal";

const InternProvement = () => {
  return Combiner(
    <div className={styles.container + ' ' + styles.whole}>
      <div className={styles.control}>
        <NavLink to="/user">
          <Button><Icon type="left" /> {intl.get("back")}</Button>
        </NavLink>
        <a target="_blank" rel="noopener noreferrer" href={Img}>
          <Button type="primary">{intl.get("download")}</Button>
        </a>
      </div>
      <img src={Img} alt="" />
    </div>
  );
}

export default InternProvement
