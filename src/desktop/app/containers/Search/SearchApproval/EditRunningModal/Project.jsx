import React from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS } from 'immutable'

import { Select, Divider, Switch } from 'antd'
import { Icon } from 'app/components'
import XfnSelect from 'app/components/XfnSelect'
import AddCardModal from 'app/containers/Config/Project/AddCardModal.jsx'
import * as Limit from 'app/constants/Limit.js'
import { CommonProjectTest } from 'app/containers/Edit/EditRunning/common/common.js'
import { systemProJectCodeCommon } from 'app/containers/Config/Approval/components/common.js'

import * as searchApprovalActions from 'app/redux/Search/SearchApproval/searchApproval.action.js'
import * as configCallbackActions from 'app/redux/Edit/EditRunning/configCallback.action.js'

@immutableRenderDecorator
export default
	class Project extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			showCardModal: false,
		}
	}

	render() {

		const {
			projectList,
			dispatch,
			projectCardList,
			projectRange,
			beProject,
			openProject,
			oriTemp,
			jrCostType,
			propertyCostList
		} = this.props
		const { showCardModal } = this.state

		return (
			<div className="approval-running-card-input-wrap">
				<span className="approval-running-card-input-tip">项目：</span>
				<span className="approval-running-card-input">
					<XfnSelect
						showSearch
						value={beProject ? (projectList.size ? (systemProJectCodeCommon.indexOf(projectList.getIn([0, 'code'])) === -1 ? `${projectList.getIn([0, 'code'])} ${projectList.getIn([0, 'name'])}` : `${projectList.getIn([0, 'name'])}`) : '') : ''}
						style={{ width: '100%' }}
						disabled={!beProject}
						dropdownRender={menu => (
							<div>
								{menu}
								<Divider style={{ margin: '4px 0' }} />
								<div
									style={openProject ? { padding: '8px', cursor: 'pointer' }: { padding: '8px', cursor: 'not-allowed'}}
									onMouseDown={() => {
										if (openProject) {
											const showModal = () => {
												this.setState({ showCardModal: true })
											}
											dispatch(configCallbackActions.beforeRunningAddProjectCard(showModal, projectRange, 'searchApproval'))
										}
									}}
								>
									<Icon type="plus" /> 新增项目
								</div>
							</div>
						)}
						onChange={(value, options) => {
							const valueList = value.split(Limit.TREE_JOIN_STR)
							const code = valueList[1]
							dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('projectList', fromJS([{
								uuid: valueList[0],
								code: code,
								type: "XM",
								name: valueList[2],
							}])))
							
							const projectProperty = options.props.projectProperty
							
							if (projectProperty === 'XZ_PRODUCE') {
								if (code === 'ASSIST') {
									dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', 'FZSCCB'))
								} else if (code === 'MAKE') {
									dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', 'ZZFY'))
								} else {
									dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', 'SCCB'))
								}
							} else if (projectProperty === 'XZ_CONSTRUCTION') {
								if (code === 'INDIRECT') {
									dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', 'JJFY'))
								} else if (code === 'MECHANICAL') {
									dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', 'JXZY'))
								} else {
									dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', 'HTCB'))
								}
							} else { // 损益项目
								if (jrCostType !== 'GLFY' || jrCostType !== 'XSFY' || jrCostType !== 'CWFY') {
									if (propertyCostList.size) {
										const str = {
											XZ_MANAGE: 'GLFY',
											XZ_SALE: 'XSFY',
											XZ_FINANCE: 'CWFY'
										}
										dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', str[propertyCostList.get(0)]))
									} else {
										dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', ''))
									}
								}
							}
						}}
					>
						{
							projectCardList && CommonProjectTest(oriTemp, projectCardList).toJS().map((v, i) => {
								return (
									<Select.Option value={`${v.uuid}${Limit.TREE_JOIN_STR}${v.code}${Limit.TREE_JOIN_STR}${v.name}`} key={i} projectProperty={v.projectProperty}>
										{systemProJectCodeCommon.indexOf(v.code) === -1 ? `${v.code} ${v.name}` : `${v.name}`}
									</Select.Option>
								)
							})
						}
					</XfnSelect>							
				</span>
				<Switch
					className="use-unuse-style"
					style={{ marginLeft: '10px' }}
					checked={beProject}
					checkedChildren={'项目'}
					unCheckedChildren={'项目'}
					onChange={() => {
						if (openProject) {
							dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('beProject', !beProject))
							if (!beProject == false) {
								dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('projectList', fromJS([])))

								if (jrCostType !== 'GLFY' || jrCostType !== 'XSFY' || jrCostType !== 'CWFY') {
									if (propertyCostList.size) {
										const str = {
											XZ_MANAGE: 'GLFY',
											XZ_SALE: 'XSFY',
											XZ_FINANCE: 'CWFY'
										}
										dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', str[propertyCostList.get(0)]))
									} else {
										dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('jrCostType', ''))
									}
								}
							}
						} else {
							dispatch(searchApprovalActions.changeApprovalProcessDetailInfoCommonString('beProject', !beProject))
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
