
import React, { Component } from 'react'
import './load.less'

import { StoreContext } from './context.js'
import { injectAsyncReducer } from 'app/utils/customStore'

export default class Bundle extends Component {

    static contextType = StoreContext

    state = {
      mod: null
    }

    componentWillMount() {
        this._isMounted = true;
        this.load(this.props);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps);
        }
    }

    // load 方法，用于更新 mod 状态
    load(props) {
        // 初始化
        this.setState({
            mod: null
        });
        /*
         调用传入的 load 方法，并传入一个回调函数
         这个回调函数接收 在 load 方法内部异步获取到的组件，并将其更新为 mod
        */

        // props.load(mod => {
        //    this.setState({
        //       mod: mod.default ? mod.default : mod
        //    });
        // });
        // props.load().then(mod => {
        //
        //     const {reducer, view, sagas} = mod;
        //
        //     // injectAsyncStore(this.context.store, reducer, sagas)
        //     // injectAsyncReducer(this.context.store, reducer)
        //
        //     this.setState({
        //         mod: mod.default ? mod.default : mod
        //     })
        // })

        props.load((mod) => {
            const { reducer, view } = mod
            // injectAsyncReducer(this.context.store, reducer)
            injectAsyncReducer(this.context, reducer)

            if (this._isMounted) {
                this.setState({
                    mod: view['default'] ? view['default'] : view,
                })
            }
        })
    }

    render() {
        return this.state.mod ? this.props.children(this.state.mod) : <div className="load-page">加载中。。。长时间未加载，请刷新</div>;
    }
};