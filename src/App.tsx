import React from 'react';
import Router from './router';
import intl from "react-intl-universal";
import { getCurrentLocale } from './controller/LocaleController';

export const locales = {
  "zh-CN": require("./locales/zh-CN.json"),
  "en-US": require("./locales/en-US.json"),
};

class App extends React.Component<any, {initDone: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = {initDone: false};
  }
  componentDidMount() {
    intl.init({
      currentLocale: getCurrentLocale(),
      locales,
    }).then(() => this.setState({initDone: true}));
  }
  render() {
    return this.state.initDone && <Router />;
  }
}

export default App;
