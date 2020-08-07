import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

// import AclistTree from './AclistTree.jsx'
import Trees from './Trees.jsx'
import { Tabs, Tag } from 'antd'
import { Icon } from 'app/components'
const TabPane = Tabs.TabPane
import * as Limit from 'app/constants/Limit.js'
import { fromJS, toJS }	from 'immutable'

import * as fzhsActions from 'app/redux/Config/Ass/assConfig.action.js'

@immutableRenderDecorator
export default
class RelateAcModal extends React.Component {

	constructor() {
		super()
		// this.state = { showall: false, currencyKey: '资产' }
		this.state = { showall: false }
	}

	render() {

		const { dispatch, asscascadeAclist, relatedAclist, disSelectAcidlist } = this.props

		const { showall, currencyKey } = this.state
		let selectedKeys = []

		const fzhsTags = ['资产', '负债', '权益', '成本', '损益']

		// let arr = {}
		// fromJS(asscascadeAclist).map((u,i) => {
		// 	if (currencyKey === i) {
		// 		return arr[i] = u.toJS()
		// 	} else {
		// 		return arr[i] = []
		// 	}
		// })


		return (
			<div className="relate-modal-wrap">
				<span>添加科目：</span>
				<div className={`relate${showall ? '' : ' ' + 'relateacmodal'}`}>
					{relatedAclist.map(v => {
						selectedKeys.push(`${v.get('acid')}${Limit.TREE_JOIN_STR}${v.get('acfullname')}`)
						return (
							<Tag className="relate-modal-item" key={v.get('acid')} closable onClose={() => dispatch(fzhsActions.deleteAcInAssItem(v.get('acid')))}>
								{`${v.get('acid')} ${v.get('acfullname')}`}
							</Tag>
						)
					})}
					<div className="relate-show" onClick={() => this.setState({showall: !showall})}>展开 <Icon type={showall ? 'up' : 'down'}/></div>
				</div>
				{/* <AclistTree
					dispatch={dispatch}
					selectedKeys={selectedKeys}
					asscascadeAclist={asscascadeAclist}
					disSelectAcidlist={disSelectAcidlist}
					showall={showall}
				/> */}
				<Tabs defaultActiveKey="资产" onChange={(key) => dispatch(fzhsActions.changeAcInAssTabKey(key))}>
				{fzhsTags.map((v, key) => {
					let currentSelectedKeys = selectedKeys.filter(w => w.indexOf(`${key+1}`) === 0 )
					return(
						<TabPane tab={v} key={v}>
							<div className="lrpz-tree-wrap">
								<Trees
									selectedKeys={currentSelectedKeys}
									Data={asscascadeAclist[v]}
									// Data={arr[v]}
									onSelect={(info) => {

										let selectedAclist = []
										info.forEach(w => {
											const ac = w.split(Limit.TREE_JOIN_STR)
											if (info.every(item => item == w ? true : item.indexOf(ac[0]) != 0) && disSelectAcidlist.indexOf(ac[0]) === -1)
												selectedAclist.push({
													acid: ac[0],
													acfullname: ac[1]
												})
										})
										dispatch(fzhsActions.modifyAclistInAssItem(key, selectedAclist))
									}}
								/>
							</div>
						</TabPane>
					)
				})}
				</Tabs>
			</div>
		)
	}
}
