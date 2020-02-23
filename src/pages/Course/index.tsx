import React from 'react';
import styles from './index.module.less';
import Combiner from '../../components/Combiner';

class Course extends React.Component {
  render() {
    return Combiner(
      <div className={styles.container}>
        课程
      </div>
    );
  }
}

export default Course;
