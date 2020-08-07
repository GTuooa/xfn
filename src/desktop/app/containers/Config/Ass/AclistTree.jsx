// import React from 'react'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
//
// import * as fzhsActions from 'app/redux/Config/Ass/assConfig.action.js'
//
// import { Tabs, Tree } from 'antd'
// import Trees from './Trees.jsx'
// const TabPane = Tabs.TabPane
// import { fromJS, toJS }	from 'immutable'
// import * as Limit from 'app/constants/Limit.js'
//
// @immutableRenderDecorator
// export default
// class AclistTree extends React.Component {
//
// 	constructor() {
// 		super()
// 		this.state = {currencyKey: '资产'}
// 	}
//
// 	shouldComponentUpdate(nextprops, nextstate) {
// 		if (this.props.showall != nextprops.showall) {
// 			return false
// 		} else {
// 			return true
// 		}
// 	}
//
// 	render() {
//
// 		const { asscascadeAclist, dispatch, selectedKeys, idx, disSelectAcidlist, showall } = this.props
// 		const { currencyKey } = this.state
//
// 		const fzhsTags = ['资产', '负债', '权益', '成本', '损益']
//
// 		let arr = {}
// 		fromJS(asscascadeAclist).map((u,i) => {
// 			if (currencyKey === i) {
// 				return arr[i] = u.toJS()
// 			} else {
// 				return arr[i] = []
// 			}
// 		})
//
// 		return (
// 			<Tabs defaultActiveKey="资产" onChange={(key) => dispatch(fzhsActions.changeAcInAssTabKey(key)) && this.setState({currencyKey : key})}>
// 			{fzhsTags.map((v, key) => {
// 				console.log('key',key);
// 				let currentselectedKeys = selectedKeys.filter(w => w.indexOf(`${key+1}`) === 0)
//
// 				console.log(currentselectedKeys);
// 				return(
// 					<TabPane tab={v} key={v}>
// 						<div className="lrpz-tree-wrap">
// 							<Trees
// 								selectedKeys={currentselectedKeys}
// 								// Data={asscascadeAclist[v]}
// 								Data={arr[v]}
// 								onSelect={(info) => {
//
// 									let selectedAclist = []
// 									info.forEach(w => {
// 										const ac = w.split(Limit.TREE_JOIN_STR)
// 										if (info.every(item => item == w ? true : item.indexOf(ac[0]) != 0) && disSelectAcidlist.indexOf(ac[0]) === -1)
// 											selectedAclist.push({
// 												acid: ac[0],
// 												acfullname: ac[1]
// 											})
// 									})
// 									dispatch(fzhsActions.modifyAclistInAssItem(idx, selectedAclist))
// 								}}
// 							/>
// 						</div>
// 					</TabPane>
// 				)
// 			})}
// 			</Tabs>
// 		)
// 	}
// }
