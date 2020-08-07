import React from 'react';
import { Provider } from 'react-redux';
import CreateRouter from 'app/containers/router.js'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { StoreContext } from './context.js'

moment.locale('zh-cn');

class App extends React.Component {

  render() {
    const { store } = this.props

    return (
      <Provider store={store} >
        <StoreContext.Provider value={store} >
          <ConfigProvider locale={zhCN}>
            <CreateRouter />
          </ConfigProvider>
        </StoreContext.Provider>
      </Provider>
    );
  }
};

export default App