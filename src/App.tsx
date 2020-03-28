import React from 'react';
import Router from './router';
import intl from "react-intl-universal";

const locales = {
  "zh-CN": require("./locales/zh-CN.json"),
};

class App extends React.Component<any, {initDone: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = {initDone: false};
  }
  componentDidMount() {
    intl.init({
      currentLocale: "zh-CN",
      locales,
    }).then(() => this.setState({initDone: true}));
  }
  render() {
    return this.state.initDone && <Router />;
  }
}

export default App;
