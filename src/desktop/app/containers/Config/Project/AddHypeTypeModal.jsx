import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Switch, Input, Select, Checkbox, Button, Modal, message, Icon, Tooltip } from 'antd'
const Option = Select.Option
const confirmModal = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
import { jxcConfigCheck } from 'app/utils'
import { SelectAc, Tab, NumberInput, XfInput } from 'app/components'
import * as Limit from 'app/constants/Limit.js'

import * as projectConfActions from 'app/redux/Config/Project/project.action.js'

@immutableRenderDecorator
export default
class AddHypeTypeModal extends React.Component {

	static displayName = 'ProjectConfAddHypeTypeModal'

	constructor() {
		super()
		this.state = {
            deleteModal : false
        }
	}

	render() {
		const {
			dispatch,
            showModal,
            closeModal,
			editPermission,
			originTags,
			activeTapKey,
			activeTapKeyUuid,
			anotherTabName,
			activeProjectType,
			projectHighTypeTemp,
			isCheckOut
		} = this.props
        const { deleteModal } = this.state
		const name = projectHighTypeTemp.get('name')
		const reserveTags = originTags.delete(0)
		const beAssist = projectHighTypeTemp.get('beAssist')
		const beMake = projectHighTypeTemp.get('beMake')
		const beIndirect = projectHighTypeTemp.get('beIndirect')
		const beMechanical = projectHighTypeTemp.get('beMechanical')
		const assistOpen = projectHighTypeTemp.get('assistOpen')
		const makeOpen = projectHighTypeTemp.get('makeOpen')
		const indirectOpen = projectHighTypeTemp.get('indirectOpen')
		const mechanicalOpen = projectHighTypeTemp.get('mechanicalOpen')
		return (
            <Modal
				visible={showModal}
				maskClosable={false}
				title={'项目管理'}
                footer={null}
                onCancel={() => closeModal()}
				width={'480px'}
            >
				<div className="jxc-config-modal-wrap inven-config-modal" style={{overflow:'hidden'}}>
					<div className="iuManage-top-title-btn">
						<div className="iuManage-high-type-title">
							<Tab
								tabList={reserveTags.toJS().map(v => ({key:v.name,value:v.name,item:v}))}
								activeKey={name}
								tabFunc={(v,item) => {
									const value = {
										name:item.name,
										uuid:item.uuid,
									}
									dispatch(projectConfActions.getProjectHighTypeOne(value))
								}}
							/>
							{/* {reserveTags.map((v,i) =>
								<span
									key={v.get('uuid')}
									className={`title-conleft ${name === v.get('name') ? 'title-selectd' : ''}`}
									onClick={() => {
										const value = {
											name:v.get('name'),
											uuid:v.get('uuid'),
										}
										dispatch(projectConfActions.getProjectHighTypeOne(value))
									}}
									>
									{v.get('name')}
								</span>
							)} */}
						</div>
					</div>
                    <div className="jxc-manage-content">
                        <div>
                            <label>类别名称：</label>
                            <span>
                                {name}
                            </span>
                        </div>
                        <div>
                            <label>功能：</label>
							{
								name === '损益项目'?
								<span>
									<label>
										<Checkbox
											checked={projectHighTypeTemp.get('commonFee')}
											onChange={(e) => {
												dispatch(projectConfActions.changePrejectHighTypeContent('commonFee', e.target.checked))
											}}
										/>
										&nbsp;
										损益公共项目
									</label>
								</span>:''
							}
							{
								name === '生产项目'?
								<span>
									<label>
										<Checkbox
											checked={beAssist}
											onChange={(e) => {
												dispatch(projectConfActions.changePrejectHighTypeContent('beAssist', e.target.checked))
											}}
										/>
										&nbsp;
										辅助生产成本
									</label>
								</span>:''
							}
							{
								name === '生产项目'?
								<span>
									<label>
										<Checkbox
											checked={beMake}
											onChange={(e) => {
												dispatch(projectConfActions.changePrejectHighTypeContent('beMake', e.target.checked))
											}}
										/>
										&nbsp;
										制造费用
									</label>
								</span>:''
							}
							{
								name === '施工项目'?
								<span>
									<label>
										<Checkbox
											checked={beIndirect}
											onChange={(e) => {
												dispatch(projectConfActions.changePrejectHighTypeContent('beIndirect', e.target.checked))
											}}
										/>
										&nbsp;
										间接费用
									</label>
								</span>:''
							}
							{
								name === '施工项目'?
								<span>
									<label>
										<Checkbox
											checked={beMechanical}
											onChange={(e) => {
												dispatch(projectConfActions.changePrejectHighTypeContent('beMechanical', e.target.checked))
											}}
										/>
										&nbsp;
										机械作业
									</label>
								</span>:''
							}
                        </div>
						<div className='qc-content'>
							{
								beAssist?

								<div>
									<label>辅助生产成本-期初值：</label>
									<Tooltip title={isCheckOut?'已结账，无法修改期初值':''}>
										<XfInput
											mode="amount"
											negativeAllowed
											placeholder='请输入金额'
											disabled={isCheckOut}
											value={assistOpen}
											onChange={(e) => {
												const value = e.target.value
												dispatch(projectConfActions.changePrejectHighTypeContent('assistOpen', value))
											}}
										/>
									</Tooltip>
								</div>:''
							}
							{
								beMake?
								<div>
									<label>制造费用-期初值：</label>
									<Tooltip title={isCheckOut?'已结账，无法修改期初值':''}>
									<XfInput
										mode="amount"
										negativeAllowed
										placeholder='请输入金额'
										disabled={isCheckOut}
										value={makeOpen}
										onChange={(e) => {
											const value = e.target.value
											dispatch(projectConfActions.changePrejectHighTypeContent('makeOpen', value))
										}}
									/>
									</Tooltip>
								</div>:''
							}
							{
								beIndirect?
								<div>
									<label>间接费用-期初值：</label>
									<Tooltip title={isCheckOut?'已结账，无法修改期初值':''}>
									<XfInput
										mode="amount"
										negativeAllowed
										placeholder='请输入金额'
										disabled={isCheckOut}
										value={indirectOpen}
										onChange={(e) => {
											const value = e.target.value
											dispatch(projectConfActions.changePrejectHighTypeContent('indirectOpen', value))
										}}
									/>
									</Tooltip>
								</div>:''
							}
							{
								beMechanical?
								<div>
									<label>机械作业-期初值：</label>
									<Tooltip title={isCheckOut?'已结账，无法修改期初值':''}>
									<XfInput
										mode="amount"
										negativeAllowed
										placeholder='请输入金额'
										disabled={isCheckOut}
										value={mechanicalOpen}
										onChange={(e) => {
											const value = e.target.value
											dispatch(projectConfActions.changePrejectHighTypeContent('mechanicalOpen', value))
										}}
									/>
									</Tooltip>
								</div>:''
							}
						</div>
						<div className="iuManage-high-type-btn" style={{marginTop:'30px',float: 'right'}}>
							<Button
								type="primary"
								disabled={!editPermission}
								onClick={() => {
									dispatch(projectConfActions.saveProjectHighType(closeModal))
								}}
							>
								保存
							</Button>
						</div>
                    </div>
                </div>
			</Modal>
		)
	}
}
