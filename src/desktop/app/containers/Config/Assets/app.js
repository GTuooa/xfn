import React from 'react'
import { connect }	from 'react-redux'

import AssetsCard from './AssetsCard'
import AssetsCategory from './AssetsCategory'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'

@connect(state => state)
export default
class Assets extends React.Component {

    componentDidMount() {
        this.props.dispatch(assetsActions.changeTabSelectedIndex('资产类别'))
		this.props.dispatch(assetsActions.getAssetsListFetch())
	}
   
    shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.assetsState != nextprops.assetsState || this.props.homeState != nextprops.homeState
	}

    render() {

        const { homeState, assetsState, allState, history } = this.props

        const tabSelectedIndex = assetsState.get('tabSelectedIndex')

        const conponent = ({
            '资产类别': () => <AssetsCategory history={history}/>,
            '资产卡片': () => <AssetsCard history={history}/>
        }[tabSelectedIndex] || (() => <div></div>))()

        return conponent

    }
}
