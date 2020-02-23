import React from 'react';
import Navigator from '../Navigator';
import Copyright from '../Copyright';

const Combiner = (component: JSX.Element) => {
  return (
    <>
      <Navigator />
      {component}
      <Copyright />
    </>
  );
}

export default Combiner;
