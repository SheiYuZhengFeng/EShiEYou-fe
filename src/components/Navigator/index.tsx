import React from 'react';
import styles from './index.module.less';
import NavigatorButton from './NavigatorButton';
import store from '../../store';

class Navigator extends React.Component {
  render() {
    const state = store.getState().UserReducer;
    return (
      <div className={`${styles.box} ${styles.whole}`}>
        <NavigatorButton href='/' title='网站首页' type='home' wrap={state.loged} />
        <NavigatorButton href='/char' title='教学特色' type='bulb' wrap={state.loged} />
        <NavigatorButton href='/about' title='关于我们' type='question-circle' wrap={state.loged} />
        <NavigatorButton href='/course' title={state.loged && state.session.category === 0 ? '购买课程' : '所有课程'} type='account-book' />
        {state.loged ? <>
          {state.session.category !== 1 ? <NavigatorButton href='/course/my' title={state.session.category === 0 ? '已购课程' : '我的课程'} type='book' /> : null}
          {state.session.category !== 2 ? <NavigatorButton href='/order' title='我的预约' type='calendar' /> : null}
          <NavigatorButton href='/mail' title='查看私信' type='message' />
        </> : null}
        <NavigatorButton href='/user' title={state.loged ? '个人中心' : '用户登录'} type='user' />
      </div>
    );
  }
}

export default Navigator;
