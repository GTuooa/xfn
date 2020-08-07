import React from 'react';
import { Provider } from 'react-redux';
import CreateRouter from 'app/containers/router.js'

import { StoreContext } from './context.js'

class App extends React.Component {

  render() {
    const { store } = this.props

    return (
        <Provider store={store} >
            <StoreContext.Provider value={store} >
                <CreateRouter />
            </StoreContext.Provider>
        </Provider>
    
    );
  }
}
export default App