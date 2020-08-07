import React, { PropTypes }	from 'react'
import { Map } from 'immutable'
import { connect }	from 'react-redux'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import '../AcConfig/ac-option.less'
import { TextInput, Button, ButtonGroup, Icon, Container, Row, Form, Amount } from 'app/components'
import thirdParty from 'app/thirdParty'
const { Label, Item } = Form

@connect(state => state)
export default
class AcReverse extends React.Component {

	constructor() {
		super()
		this.state = {confirmStr: false, inputValue: ''}
	}
	componentDidMount() {
		thirdParty.setTitle({title: '反悔模式'})
		thirdParty.setRight({show: false})
		this.props.dispatch(acconfigActions.changeAcShowReverseModal(false))
	}
	render() {
		const {
			allState,
			acconfigState,
			dispatch,
			history
		} = this.props
		const { confirmStr, inputValue } = this.state

		const reverseSeved = acconfigState.get('reverseSeved')
		const NewAcReverseId = acconfigState.get('NewAcReverseId')
		const NewAcReverseName = acconfigState.get('NewAcReverseName')
		const showReverseModal = acconfigState.get('showReverseModal')
		const reverseAc = acconfigState.get('reverseAc')
		const acid = reverseAc.get('acid')
		const categoryList = reverseAc.get('categoryList')
		const acCount = reverseAc.get('acCount')
		const openingbalance = reverseAc.get('openingbalance')
		const isloading = allState.get('isloading')

		return (
			<Container className={showReverseModal ? "ac-option" : 'ac-revense'}>
				{isloading ? <div className="unloadedMask"></div> : ''}
				<Row flex='1' style={{display: showReverseModal ? 'none' : ''}}>
					<div className="top-tip ac-option-first-tip">
						<div className="top-tip-text">
							<span className="top-tip-title-normal">关于反悔模式：</span>
							<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;一般情况下，带有辅助核算／期初值／已在凭证中使用过的科目不允许增加下级科目；</span>
							<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;反悔模式可将此类科目增加下级科目，并把原科目下的数据转移至其下级科目；</span>
							<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;此操作为不可逆操作，一经增加则数据不可回退；</span>
							<div className="top-tip-item-input">
								{/* 数字输入框 */}
								<TextInput
									placeholder="请输入要反悔的科目编码"
									onChange={value => this.setState({inputValue: value})}
								/>
								<span
									className="top-tip-item-input-text"
									onClick={() => {
										if (inputValue.length !== 4 && inputValue.length !== 6 && inputValue.length !== 8)
											return thirdParty.Alert('只有科目编码为4/6/8的科目可以使用反悔模式')
										dispatch(acconfigActions.getReportAcReverseCheck(inputValue, '', history))
									}}
									>校验</span>
							</div>
							<div className="top-tip-item-input-underline"><span className="text-underline">本操作将校验该科目是否需要使用反悔模式</span></div>
						</div>
					</div>
				</Row>
				<Row flex='1' style={{display: showReverseModal ? '' : 'none'}}>
					<Form>
						<Item label="科目：">
							<span>{acid}</span>
						</Item>
						<div className="top-tip ac-option-first-tip">
							<div className="top-tip-text">
								<span className="top-tip-title-normal">该科目已使用的内容</span>
								{
									categoryList.size > 0 ?
									<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;辅助核算：{categoryList.reduce((v ,pre) => v + '、' + pre)}</span> :
									''
								}
								{
									openingbalance > 0 ?
									<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;期初值：<Amount>{openingbalance}</Amount></span> :
									''
								}
								{
									acCount > 0 ?
									<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;有相关的凭证</span> :
									<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;没有相关的凭证</span>
								}
							</div>
						</div>
						<ul className="form-tip">
							<li className="form-tip-item">
								以上内容将转移至新增下级科目中；
							</li>
							<li className="form-tip-item">
								子科目将自动继承上级科目的余额方向、类别；
							</li>
						</ul>
						<Item label="新增下级科目编码：" className="form-item-acid-front">
							<span className="form-item-acid-front-acid">{acid}</span>
							<TextInput
								value={NewAcReverseId}
								onChange={value => dispatch(acconfigActions.createNewAcId(value, acid))}
							/>
						</Item>
						<Item label="新增下级科目名称：">
							<TextInput
								value={NewAcReverseName}
								// placeholder="填写名称 (最长20个字符)"
								onChange={value => dispatch(acconfigActions.createNewAcName(value))}
							/>
						</Item>
					</Form>
					<div className="top-tip-break">信息确认</div>
					<div
						className="top-tip"
						onClick={() => this.setState({confirmStr: !confirmStr})}
						>
						<Icon
							className="top-tip-icon"
							type='xuanze'
							style={{color: confirmStr ? '#cc0000' : '#ccc', border: 'none'}}
						/>
						<div className="top-tip-text">
							<span className="top-tip-title">继续操作请勾选：</span>
							<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;该操作为不可逆操作；</span>
							<span className="top-tip-item">&nbsp;&nbsp;&nbsp;&nbsp;原科目下所有数据将会被转移且不可回退!</span>
						</div>
					</div>
				</Row>
				<Row>
					<ButtonGroup type='ghost' height={50} style={{display: showReverseModal ? '' : 'none'}}>
						<Button disabled={!confirmStr || reverseSeved} onClick={() => dispatch(acconfigActions.getReportAcRegretUse(acid, acid+''+NewAcReverseId, NewAcReverseName))}><Icon type="save"/>保存</Button>
						<Button onClick={() => {
						}}><Icon type="cancel"/>{reverseSeved ? '返回' : '取消'}</Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}
