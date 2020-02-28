import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';
import store from '../../store';
import Login from './Login';
import Register from './Register';

class User extends React.Component<{}, {loged: boolean, view: number, information: {}}> {
  constructor(props: any) {
    super(props);
    this.state = {information: {}, ...store.getState().UserReducer};
  }
  ss = store.subscribe(() => {
    this.setState({...this.state, ...store.getState().UserReducer});
  });
  panel = () => {
    return (
      <>
        信息面板
      </>
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
