import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Tag, Tabs, Tree, Modal } from 'antd'
import { Icon } from 'app/components'
const TabPane = Tabs.TabPane
import Trees from './Trees.jsx'
import * as Limit from 'app/constants/Limit.js'
import './style/index.less'

import * as currencyActions from 'app/redux/Config/Currency/currency.action.js'

@immutableRenderDecorator
export default
class SelectAcModal extends React.Component {

	constructor() {
		super()
		this.state = {showall: false}
	}

	render() {

		const {
			dispatch,
			acListTree,
			relatedAclist,
			acRelateFCList,
			acListModalDisplay
		} = this.props

		const { showall } = this.state

		let selectedKeys = []
		const currencyTags = ['资产', '负债', '权益', '成本', '损益']

		return (
			<Modal
				okText="确定"
				cancelText="取消"
				title="编辑关联科目"
				maskClosable={false}
				visible={acListModalDisplay}
				onCancel={() => dispatch(currencyActions.changeSelectAcListModalDisplay())}
				onOk={() => dispatch(currencyActions.changeRelatedAcListFetch(relatedAclist))}

				>
				<div>
					<span>添加科目：</span>
					<div className={`relate${showall ? '' : ' ' + 'relateacmodal'}`}>
						{(relatedAclist || []).map(v => {
							selectedKeys.push(`${v.get('acid')}${Limit.FC_JOIN_STR_CONNECT}${v.get('acfullname')}`)

							return (
								<Tag className="relate-modal-item" key={v.get('acid')} closable onClose={() => dispatch(currencyActions.deleteRelateAcItem(v.get('acid')))}>
									{`${v.get('acid')} ${v.get('acfullname')}`}
								</Tag>
							)
						})}
						<div className="relate-show" onClick={() => this.setState({showall: !showall})}>展开 <Icon type={showall ? 'up' : 'down'}/></div>
					</div>
					<Tabs defauActiveKey="资产" onChange={(key) => dispatch(currencyActions.changeAcTabKey(key))}>
						{currencyTags.map((v, key) => {
							let currentSelectedKeys = selectedKeys.filter(w => w.indexOf(`${key+1}`) === 0)
							return(
								<TabPane tab={v} key={v}>
									<div className="lrpz-tree-wrap">
										<Trees
											Data={acListTree[v]}
											selectedKeys={currentSelectedKeys}
											onSelect={(info) => {
												let selectedAclist = []
												info.forEach(w => {
													const ac = w.split(Limit.FC_JOIN_STR_CONNECT)
													if (info.every(item => item == w ? true : item.indexOf(ac[0]) != 0)) {
														selectedAclist.push({
															acid: ac[0],
															acfullname: ac[1]
														})
													}
												})
												dispatch(currencyActions.modifyRelatedAcList(selectedAclist))
											}}
										/>
									</div>
								</TabPane>
							)
						})}
					</Tabs>
				</div>
			</Modal>
		)
	}
}
