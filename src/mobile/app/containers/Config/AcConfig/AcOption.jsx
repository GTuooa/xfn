import React, { PropTypes }	from 'react'
import { Map } from 'immutable'
import { connect }	from 'react-redux'
import { fromJS, toJS } from 'immutable'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import * as allActions from 'app/redux/Home/All/aclist.actions'
import './ac-option.less'
import { SwitchText, Switch, TextInput, Button, ButtonGroup, Icon, Container, Row, Form, ScrollView, SinglePicker } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'

const {
	Label,
	Control,
	Item
} = Form

@connect(state => state)
export default
class AcOption extends React.Component {

	constructor() {
		super()
		this.state = {
			prevAcunit: ''
		}
	}
	componentDidMount() {
		if (this.props.acconfigState.get('acConfigMode') === 'modify') {
			thirdParty.setTitle({title: '编辑科目'})
		} else if (this.props.acconfigState.get('acConfigMode') === 'insert') {
			thirdParty.setTitle({title: '新增科目'})
		}
		thirdParty.setRight({show: false})

		this.setState({
			prevAcunit: this.props.acconfigState.getIn(['ac', 'acunit'])
		})
	}
	render() {
		const {
			allState,
			acconfigState,
			dispatch,
			history,
			homeState
		} = this.props
		const { prevAcunit  } = this.state

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const ac = acconfigState.get('ac')
		const acTags = allState.get('acTags')
		const firstChar = ac.get('acid').charAt(0)
		const tags = acTags.getIn([firstChar && firstChar - 1, 'sub']) || fromJS([])
		const aclist = allState.get('aclist')

		const fromfirts = acconfigState.get('fromfirts')
		const acConfigMode = acconfigState.get('acConfigMode')

		//判断是否是一级科目
		const isSub = ac.get('acid').length > 4

		const source = tags.size === 0 ? fromJS([]) : tags.map(v => {return {value: `${v}`, key: `${v}`}})

		// 是否有下级科目
		const nextac = aclist.some(v => !v.get('acid').indexOf(ac.get('acid')) && v.get('acid') !== ac.get('acid') )

		// 科目类别 置灰条件： 有下级科目 或者 有辅助核算 或者 有上级科目
		const isDisabled = nextac || !!ac.get('asscategorylist').size || !!ac.get('upperid')

		const moduleInfo = homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])

		const NUMBERCanUse = moduleInfo ? (moduleInfo.indexOf('NUMBER') > -1 ? true : false) : false

		return (
			<Container className="ac-option">
				<ScrollView flex="1" uniqueKey="ac-config-option-scroll" savePosition>
				{/* <Row flex="1"> */}
					<Form>
						<Item label="科目编码：" className="form-offset-up">
							{/* 数字 */}
							<TextInput
								textAlign="right"
								value={ac.get('acid')}
								placeholder={fromfirts ? "填写数字 (限4个数字)" : "填写数字 (限6/8/10个数字)"}
								onChange={value => dispatch(acconfigActions.changeAcId(value, allState.get('aclist').toSeq()))}
							/>
							&nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
						</Item>
						<ul className="form-tip">
							<li className="form-tip-item">
								科目编码支持最长四级，一级科目必须以1/2/3/4/5开头且长度分别为4/6/8/10位数字；
							</li>
						</ul>
						<Item label="科目名称：" className="form-offset-up">
							<TextInput
								textAlign="right"
								value={ac.get('acname')}
								placeholder={`包含中文最长${Limit.AC_CHINESE_NAME_LENGTH}个字符，否则最长${Limit.AC_NAME_LENGTH}个`}
								onChange={value => dispatch(acconfigActions.changeAcName(value))}
							/>
							&nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
						</Item>
						<Item label="上级科目：" className="form-offset-up form-offset-margin">
							<TextInput
								textAlign="right"
								className="form-input"
								value={ac.get('upperid') ? ac.get('upperinfo') : '无'}
								disabled
							/>
						</Item>
						<Item label="余额方向：" className="form-offset-up form-offset-margin">
							<SwitchText
								checked={ac.get('direction') === 'debit'}
								checkedChildren="借"
								unCheckedChildren="贷"
								onChange={() => dispatch(acconfigActions.changeJvDirection())}
							/>
						</Item>
						<div className="form-select">
						{/* <Item className="form-offset-up form-offset-margin"> */}
							<label className={`form-select-text${ac.get('acid') === '' ? '-disabled' : ''}`}>科目类别：</label>
							{/* {
								ac.get('acid') ?
								<Select
									className="form-select-select"
									source={source}
									text={ac.get('category') ? ac.get('category') : '请选择'}
									onOk={(result) => dispatch(acconfigActions.changeCategory(result.value))}
								/> : ''
							}
							{	isDisabled ?
								<span className="form-select-show">{ac.get('category')}</span>
								:
								(ac.get('acid') ?
								<Select
									className="form-select-select"
									source={source}
									text={ac.get('category') ? ac.get('category') : '请选择'}
									onOk={(result) => dispatch(acconfigActions.changeCategory(result.value))}
								/> : '')
							} */}
							{
								isDisabled ?
								<div className="form-select-just-show">
									<span>
										{ac.get('category')}
									</span>
								</div> :
								(ac.get('acid') ?
										<SinglePicker
											className="form-select-show-select"
											district={source}
											onOk={(result) => dispatch(acconfigActions.changeCategory(result.value))}
										>
											<div className="form-select-show">
												<span>{ac.get('category') ? ac.get('category') : '请选择'}</span>
											</div>
										</SinglePicker>  : ''
								)
							}
						</div>
						<ul className="form-tip">
							<li className="form-tip-item">
								科目类别已根据国家小企业会计准则预置；
							</li>
							<li className="form-tip-item">
								新增子科目时，子科目将自动继承上级科目的余额方向、类别；
							</li>
						</ul>
						{
							NUMBERCanUse ?
							<Item label="数量核算：" className="form-offset-up form-amount form-offset-border">
								<Switch
									checked={ac.get('acunitOpen') === '1'}
									onClick={() => {
										dispatch(acconfigActions.changeAcAmountStateText(acConfigMode, prevAcunit))
									}}
								/>
							</Item> : ''
						}
						{
							NUMBERCanUse ?
							<Item label="计算单位："
								className="form-offset-up"
								style={{display: ac.get('acunitOpen') === '1' ? '' : 'none'}}
								>
								{ac.get('acunitOpen') === '1' && prevAcunit == '' ?
										<TextInput
											textAlign="right"
											className="form-input"
											value={ac.get('acunit')}
											placeholder="请输入单位名称"
											onChange={value => dispatch(acconfigActions.changeAcconfigAcunit(value))}
										/> : ''
								}
								<span style={{display: ac.get('acunitOpen') === '1' && prevAcunit == '' ? '' : 'none' }}>&nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" /></span>
								<span
									className="acunitOpen-modify"
									style={{display: ac.get('acunitOpen') === '1' && prevAcunit ? '' : 'none' }}
									onClick={() => {
										history.push('/config/modifyunit')
									}}
									>
										<span >{ac.get('acunit')}</span>
										&nbsp;<Icon type="arrow-right" className="ac-option-icon" size="14" />
								</span>
							</Item> : ''
						}
					</Form>
				</ScrollView>
				<Row>
					<ButtonGroup type='ghost' height={50}>
						<Button onClick={() => dispatch(acconfigActions.cancelEnterAcFetch(history))}><Icon type="cancel"/>取消</Button>
						<Button
							disabled={!editPermission}
							onClick={() => {
								if (ac.get('acunitOpen') == '1' && !ac.get('acunit')) {
									return thirdParty.Alert('请输入计量单位')
								}
								if (ac.get('acunit').length > Limit.AC_UNIT_LENGTH) {
									return thirdParty.Alert(`计算单位位数不能超过${Limit.AC_UNIT_LENGTH}位`)
								}

								const isChinese = /[\u4e00-\u9fa5]/g
								const isChineseSign = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g
								// ： 。 ；  ， ： “ ”（ ） 、 ？ 《 》

								let acnameLimitLength = Limit.AC_CHINESE_NAME_LENGTH
								// if (acConfigMode === 'modify') {
								// 	acnameLimitLength = Limit.AC_NAME_ABLE_LENGTH
								// }
								if (!isChinese.test(ac.get('acname')) && !isChineseSign.test(ac.get('acname'))) {
									acnameLimitLength = Limit.AC_NAME_LENGTH
								}
								
								if (ac.get('acname').length > acnameLimitLength){
									return thirdParty.Alert(`科目名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；否则，长度不能超过${Limit.AC_NAME_LENGTH}位`)
								}
								dispatch(allActions.enterAcFetch(fromfirts, history))
							}}
							>
							<Icon type="save"/>保存
						</Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}
