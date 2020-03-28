import React from "react";
import styles from "./index.module.less";
import NavigatorButton from "./NavigatorButton";
import store from "../../store";
import { STUDENT, FOREIGN } from "../UserDescriptions";
import intl from "react-intl-universal";

class Navigator extends React.Component {
  render() {
    const state = store.getState().UserReducer;
    return (
      <div className={`${styles.box} ${styles.whole}`}>
        <NavigatorButton href="/" title={intl.get("navbar_home")} type="home" wrap={state.loged} />
        <NavigatorButton href="/char" title={intl.get("navbar_char")} type="bulb" wrap={state.loged} />
        <NavigatorButton href="/about" title={intl.get("navbar_about")} type="question-circle" wrap={state.loged} />
        <NavigatorButton href="/course" title={state.loged && state.session.category === STUDENT ? intl.get("navbar_allcourse_student") : intl.get("navbar_allcourse")} type="account-book" />
        {state.loged ? <>
          <NavigatorButton href="/mycourse" title={state.session.category === STUDENT ? intl.get("navbar_mycourse_student") : intl.get("navbar_mycourse")} type="book" />
          {state.session.category !== FOREIGN ? <NavigatorButton href="/order" title={intl.get("navbar_order")} type="calendar" /> : null}
          <NavigatorButton href="/bill" title={state.session.category === STUDENT ? intl.get("navbar_bill_student") : intl.get("navbar_bill")} type="money-collect" />
          <NavigatorButton href="/mail" title={intl.get("navbar_mail")} type="message" />
        </> : null}
        <NavigatorButton href="/user" title={state.loged ? intl.get("navbar_user") : intl.get("navbar_login")} type="user" />
      </div>
    );
  }
}

export default Navigator;
