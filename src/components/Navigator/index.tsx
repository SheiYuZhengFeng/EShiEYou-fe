import React from "react";
import styles from "./index.module.less";
import NavigatorButton from "./NavigatorButton";
import store from "../../store";
import { STUDENT, FOREIGN } from "../UserDescriptions";
import intl from "react-intl-universal";
import { Modal, Button, Menu, Dropdown, message } from "antd";
import { locales } from "../../App";
import { switchLocale } from "../../controllers/LocaleController";
import { NavLink } from "react-router-dom";
import GeneralAPI from "../../services/GeneralAPI";
import { LogoutAction, toLoginAction, toRegisterAction } from "../../actions/UserAction";

const { Item } = Menu

class Navigator extends React.Component {
  handleLanguage = () => {
    Modal.info({
      title: "语言 Language",
      content: (
        <div style={{marginTop: "2em"}}>
          {Object.keys(locales).map((v, i) => <Button key={i} style={{marginLeft: "1em"}} onClick={switchLocale.bind(this, v)}>{v}</Button>)}
        </div>
      ),
      okText: "关闭 Close",
      maskClosable: true,
    });
  }
  render() {
    const state = store.getState().UserReducer;
    const confirmLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      Modal.confirm({
        title: intl.get("ready_to_logout"),
        content: intl.get("confirm_to_logout_message"),
        okText: intl.get("ok"),
        cancelText: intl.get("cancel"),
        onOk() {
          const hide = message.loading(intl.get("logingout"), 0);
          GeneralAPI.user.logout().then(res => {
            hide();
            message.success(intl.get("logedout"));
            LogoutAction();
            window.location.href = '/';
          });
        },
      });
    }
    const userMenu = (
      <Menu>
        {state.loged &&
          <Item>
            <NavLink to="/user">{intl.get("navbar_user")}</NavLink>
          </Item>
        }
        {state.loged &&
          <Item>
            <a onClick={confirmLogout} href="/">退出登录</a>
          </Item>
        }
        {!state.loged &&
          <Item>
            <NavLink to="/user" onClick={toLoginAction}>{intl.get("login")}</NavLink>
          </Item>
        }
        {!state.loged &&
          <Item>
            <NavLink to="/user" onClick={toRegisterAction}>{intl.get("register")}</NavLink>
          </Item>
        }
      </Menu>
    );
    return (
      <div className={`${styles.box} ${styles.whole}`}>
        <div className={styles.left}>
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
        </div>
        <div className={styles.right}>
          <NavigatorButton href="" title="语言 Language" type="global" wrap onClick={this.handleLanguage} />
          <Dropdown overlay={userMenu} trigger={['click']}>
            <NavigatorButton href="/user" title="用户" wrap type="user" />
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default Navigator;
