import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Select, Divider, Icon, Switch } from 'antd'
import AddCardModal from 'app/containers/Config/Relative/AddCardModal.jsx'
import * as Limit from 'app/constants/Limit.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'

@immutableRenderDecorator
export default
	class Relative extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
		}
	}

	render() {

		const {
			contactList,
			dispatch,
			contactCardList,
			contactsRange,
			beContact,
			contactsManagement
		} = this.props
		const { showCardModal } = this.state

		return (
			<div className="approval-running-card-input-wrap">
				<span className="approval-running-card-input-tip">往来单位：</span>
				<span className="approval-running-card-input">					
					<Select
						showSearch
						value={beContact ? (contactList.size ? `${contactList.getIn([0, 'code'])} ${contactList.getIn([0, 'name'])}` : '') : ''}
						style={{ width: '100%' }}
						placeholder=""
						disabled={!beContact}
						dropdownRender={menu => (
							<div>
								{menu}
								<Divider style={{ margin: '4px 0' }} />
								<div
									style={contactsManagement ? { padding: '8px', cursor: 'pointer' }: { padding: '8px', cursor: 'not-allowed'}}
									onMouseDown={() => {
										if (contactsManagement) {
											const showModal = () => {
												this.setState({ showCardModal: true })
											}
											dispatch(configCallbackActions.beforeRunningAddRelativeCard(showModal, contactsRange, 'lrls'))
										}
									}}
								>
									<Icon type="plus" /> 新增往来单位
						</div>
							</div>
						)}
						onChange={value => {
							const valueList = value.split(Limit.TREE_JOIN_STR)
							dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('contactList', fromJS([{
								uuid: valueList[0],
								code: valueList[1],
								type: "WLDW",
								name: valueList[2],
							}])))
						}}
					>
						{
							contactCardList && contactCardList.toJS().map((v, i) => <Select.Option value={`${v.uuid}${Limit.TREE_JOIN_STR}${v.code}${Limit.TREE_JOIN_STR}${v.name}`} key={i}>{`${v.code} ${v.name}`}</Select.Option>)
						}
					</Select>
				</span>
				<Switch
					className="use-unuse-style"
					style={{ marginLeft: '10px' }}
					checked={beContact}
					checkedChildren={'往来'}
					unCheckedChildren={'往来'}
					onChange={() => {
						if (contactsManagement) {
							dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('beContact', !beContact))
							// if (!beContact == false) {
							// 	dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('contactList', fromJS([])))
							// }
						} else {
							dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('beContact', !beContact))
						}
					}}
				/>
				<AddCardModal
					showModal={showCardModal}
					closeModal={() => this.setState({ showCardModal: false })}
					dispatch={dispatch}
					fromPage={'searchApproval'}
				/>
			</div>
		)
	}
}