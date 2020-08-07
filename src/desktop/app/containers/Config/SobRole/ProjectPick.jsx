import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, fromJS } from 'immutable'

import * as Limit from 'app/constants/Limit.js'
import { Button, TreeSelect } from 'antd'
import { Icon } from 'app/components'
import thirdParty from 'app/thirdParty'
import { formatCommonCardList } from 'app/containers/Config/Approval/components/common.js'

import SingleModal from './SingleModal'

import * as sobRoleActions from 'app/redux/Config/SobRole/sobRole.action.js'

@immutableRenderDecorator
export default
class ProjectPick extends React.Component {

	constructor(props) {
		super(props)
		this.state = {showModal: false}
	}

	render() {

		const {
            title,
			dispatch,
			categoryRange,
			allCardListL,
			modalCategoryList,
			modalCardList,
			selectCardList,
			rangeList,
			moduleItemName,
			placement,
			deleteAllRange,
        } = this.props
		const { showModal } = this.state

		const inList = rangeList.get('in') ? rangeList.get('in') : fromJS([])
		const outList = rangeList.get('out') ? rangeList.get('out') : fromJS([])

		return (
			<div className="sob-role-detail-item-range-wrap">
				<span>{`${title}：`}</span>
				<span className="sob-role-detail-input">
					<div className="sob-role-detail-input-item-wrap">
						<div>
							<ul className="approval-card-input-item-container">
								{
									inList.map((v, i) => {
										return (
											<li>
												<span>{v.get('code') ? v.get('code')+'_'+v.get('name') : v.get('name')}</span>
												<Icon
													type="close" 
													onClick={() => {
														const newStockScope = inList.delete(i)
														dispatch(sobRoleActions.setSobRoleModuleListValue([moduleItemName, ...placement, 'in'], newStockScope))
													}}
												/>
											</li>
										)
									})
								}
							</ul>
						</div>
					</div>
					<div
						className='sob-role-detail-chosen-word'
						onClick={() => {
                            dispatch(sobRoleActions.getProjectTreeList(categoryRange, () => {
								this.setState({showModal: true})
							}))
						}}
					>
						选择
					</div>
                </span>
				<span className="sob-role-detail-input-lable-right">排除范围：</span>
				<span className="sob-role-detail-input">
					<TreeSelect
						multiple
						style={{ width: '100%' }}
						value={outList.size ? outList.map(v => `${v.get('uuid')}${Limit.TREE_JOIN_STR}${v.get('code')}${Limit.TREE_JOIN_STR}${v.get('name')}`).toJS() : []}										
						dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
						treeData={formatCommonCardList(allCardListL)}
						placeholder="选填"
						treeDefaultExpandAll
						onChange={(value) => {
							let valueList = []
							value.forEach(v => {
								const strList = v.split(Limit.TREE_JOIN_STR)
								valueList.push({
									uuid: strList[0],
									code: strList[1],
									name: strList[2],
									top: false,
									type: 'CARD',
								})
							})
							dispatch(sobRoleActions.setSobRoleModuleListValue([moduleItemName, ...placement, 'out'], fromJS(valueList)))
						}}
					/>
				</span>
                <Icon className='sob-role-detail-delete-icon' type="delete" onClick={() => deleteAllRange('PROJECT')} />
                {
                    showModal ?
                    <SingleModal
						title={'项目范围选择'}
						modalCategoryList={modalCategoryList}
						modalCardList={modalCardList}
						selectList={inList ? inList.toJS() : []}
						onOk={(value) => {
							const valueList = value
							dispatch(sobRoleActions.setSobRoleModuleListValue([moduleItemName, ...placement, 'in'], fromJS(valueList)))
						}}
						selectListFunc={(uuid, level) => {
							if (uuid === 'all') {
								dispatch(sobRoleActions.getProjectAllCardList(categoryRange, 'stock', true))
							} else {
								dispatch(sobRoleActions.getProjectSomeCardList(uuid, level))
							}
						}}
						closeModal={() => {
							this.setState({showModal: false})
						}}
                    />	
                    : null
                }
			</div>
		)
	}
}