import React, { PropTypes } from 'react'
import { Map, fromJS } from 'immutable'
import { connect }	from 'react-redux'

import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import * as assAllActions from 'app/redux/Home/All/asslist.actions'
import './ass-option.less'
import { Switch, TextInput, Button, ButtonGroup, Container, Form, Row, Icon, SinglePicker } from 'app/components'
const Item = Form.Item
import * as thirdParty from 'app/thirdParty'

@connect(state => state)
export default
class AssOption extends React.Component {

	constructor() {
		super()
		this.state = {newcategory: ''}
	}
	componentDidMount() {

	}
	render() {
		const {
			assconfigState,
			allState,
			history,
			dispatch,
			homeState
		} = this.props
		const { newcategory } = this.state

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		thirdParty.setRight({show: false})
		const assConfigMode = assconfigState.get('assConfigMode')
		if (assConfigMode === 'insert')
			thirdParty.setTitle({title: '新增辅助核算'})
		else if (assConfigMode === 'modify') {
			thirdParty.setTitle({title: '修改辅助核算'})
		}

		const ass = assconfigState.get('ass')
		const canModifyCategory = assconfigState.get('assConfigMode') === 'insert'
		const tags = allState.get('assTags')
		const source = tags.size === 0 ? fromJS([]) : tags.map(v => {return {value: `${v}`, key: `${v}`}}).push({value: `${'输入自定义'}`, key: `${'输入自定义'}`})
		const asscategory = ass.get('asscategory')

		return (
			<Container className="ass-option">
				<Row flex="1">
					<Form>
						<Item label="编码：" className="form-offset-up">
							<TextInput
								type="text"
								textAlign="right"
								value={ass.get('assid')}
								// placeholder="填写数字 (最长20位数字)"编码支持数字和大小写英文字母
								placeholder="输入编码 (限16位数字字母)"
								onChange={value => dispatch(assconfigActions.changeAssId(value))}
							/>
							&nbsp;<Icon type="arrow-right" className="input-icon-arrow-right"/>
						</Item>
						<Item label="名称：" className="form-offset-up form-offset-margin">
							<TextInput
								type="text"
								textAlign="right"
								value={ass.get('assname')}
								placeholder="输入名称"
								onChange={value => dispatch(assconfigActions.changeAssName(value))}
							/>
							&nbsp;<Icon type="arrow-right" className="input-icon-arrow-right"/>
						</Item>
						<Item label="类别：" className="form-offset-up form-offset-margin form-offset-border">
							{
								canModifyCategory ?
								<SinglePicker
									className="info-select"
									district={source}
									value={ass.get('asscategory') ? ass.get('asscategory') : '请选择'}
									style={{color: ass.get('asscategory') ? '#333' : '#999'}}
									onOk={(result) => {
										if (result.value === '输入自定义') {
											thirdParty.Prompt({
												message: '输入自定义类别:',
												buttonLabels: ['取消', '确认'],
												onSuccess: (result) => {
													if (result.buttonIndex === 1) {
														dispatch(assconfigActions.changeAssCategory(result.value))
													} else {
														return
													}
												},
												onFail: () => {}
											})
										} else {
											dispatch(assconfigActions.changeAssCategory(result.value))
										}
									}}
								>
									<span>{ass.get('asscategory') ? ass.get('asscategory') : '请选择'}</span>
								</SinglePicker> : <span>{ass.get('asscategory') ? ass.get('asscategory') : '无类别'}</span>
							}
						</Item>
						<Item label="状态：" className="form-offset-up form-disable" style={{display: assConfigMode === 'insert' ? 'none' : ''}}>
							<span className="form-disable-name">{ass.get('disable') === 'TRUE' ? '已禁用' : '已启用'}</span>
							<Switch
								checked={ass.get('disable') !== 'TRUE'}
								checkedChildren=""
								unCheckedChildren=""
								onClick={() => dispatch(assconfigActions.changeAssDisableState())}
							/>
						</Item>
						<div className="ass-tip">点击类别名称，可以自定义类别</div>
						{/* <ul className="form-tip"> */}
						{/* <TipWrap>
							<li className="form-tip-item">
								系统预置“客户”、“供应商”、“职员”、“项目”、“部门”五种辅助核算类别，这五种类别不能被修改或删除；
							</li>
							<li className="form-tip-item">
								用户可自定义辅助核算类别，但该类别下应至少有一个“编码”，否则该类别将被自动删除；
							</li>
							<li className="form-tip-item">
								若要自定义辅助核算类别，请先选择自定义方可操作；
							</li>
						</TipWrap> */}
					</Form>
				</Row>
				<ButtonGroup type='ghost' height={50}>
					<Button onClick={() => history.goBack()}><Icon type="cancel"/><span>取消</span></Button>
					<Button disabled={!editPermission} onClick={() => dispatch(assAllActions.enterAssFetch(history))}><Icon type="save"/><span>保存</span></Button>
				</ButtonGroup>
			</Container>
		)
	}
}
