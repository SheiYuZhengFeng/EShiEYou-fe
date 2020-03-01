import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import store from '../../store';
import Login from './Login';
import Register from './Register';
import { Spin, Avatar } from 'antd';
import StudentAPI from '../../services/StudentAPI';
import NativeAPI from '../../services/NativeAPI';
import ForeignAPI from '../../services/ForeignAPI';
import QueueAnim from 'rc-queue-anim';
import { informationAction } from '../../actions/UserAction';
import UserDescriptions from '../../components/UserDescriptions';

class User extends React.Component<{}, {loged: boolean, view: number, information: any}> {
  constructor(props: any) {
    super(props);
    this.state = {information: {}, ...store.getState().UserReducer};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, ...store.getState().UserReducer});
  });
  panel = () => {
    if (Object.keys(this.state.information).length === 0) {
      const deal = (res: SimpleResponse) => {
        if (res.code === 0) {
          informationAction(res.data);
        }
      }
      const { category } = store.getState().UserReducer.session;
      if (category === 0) StudentAPI.main.me().then(res => deal(res));
      if (category === 1) NativeAPI.main.me().then(res => deal(res));
      if (category === 2) ForeignAPI.main.me().then(res => deal(res));
      return <Spin size="large" />;
    }
    const i = this.state.information;
    return (
      <QueueAnim className={styles.panel}>
        <Avatar key="0" className={styles.avatar} size={64}>
          {i.name}
        </Avatar>
        <UserDescriptions className={styles.description} key="1" title="" information={i} />
      </QueueAnim>
    );
  }
  render() {
    return Combiner(
      <div className={styles.container + ' ' + styles.whole}>
        {this.state.loged ? this.panel() : (this.state.view === 0 ? <Login /> : <Register />)}
      </div>
    );
  }
}

export default User;
