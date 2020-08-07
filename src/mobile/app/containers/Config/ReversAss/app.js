import React, { PropTypes } from 'react'
import { Map, fromJS } from 'immutable'
import { connect }	from 'react-redux'
import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import './ass-reverse.less'
import { TextInput, Button, ButtonGroup, Container, Form, Row, Icon, ScrollView, SinglePicker } from 'app/components'
const Item = Form.Item
import * as Limit from 'app/constants/Limit.js'
import InfoConfirm from './InfoConfirm.jsx'
import AssTypeChangeConfirm from './AssTypeChangeConfirm'
import { showMessage, configCheck } from 'app/utils'

@connect(state => state)
export default
class ReversAss extends React.Component {

	constructor() {
		super()
		this.state = {showInfo: false}
	}

	render() {
		const {
            dispatch,
			assconfigState,
			history,
			allState,
			homeState
		} = this.props
		const { showInfo } = this.state

        const reversAss = assconfigState.get('reversAss')
        const assMessage = assconfigState.get('assMessage')
        const showReversModal = assconfigState.get('showReversModal')

        //通过当前选择的tab栏索引获取到相应类别
        const assTags = allState.get('assTags')
		const tabSelectedIndex = assconfigState.get('tabSelectedIndex')
		const tabSelectedAssCategory = assTags.get(tabSelectedIndex)
        const assTagsSelect = assTags.map(u => ({
            key: u,
            value: u
        }))

        //通过类别获取当前acasslist中相应的索引和具体对象
		const acAssSelectedIndex = allState.get('acasslist').findKey(v => v.get('asscategory') == reversAss.get('assCategory'))
		const acass = allState.getIn(['acasslist', acAssSelectedIndex])
		//获取acass中的aclist和asslist(插入类别)
		const asslist = acass ? acass.get('asslist').map(v => v.set('asscategory', reversAss.get('assCategory'))) : fromJS([])
        const asslistSelect = asslist.map((u,i) => ({
            key: `${u.get('assid')} ${u.get('assname')}`,
            value: `${u.get('assid')}${Limit.TREE_JOIN_STR}${u.get('assname')}`
        }))
		const ifAssConfig = assconfigState.get('ifAssConfig')
		const oldName = assconfigState.get('oldName')
		const newName = assconfigState.get('newName')
		const showAssTypeChangeConfirmModal = assconfigState.get('showAssTypeChangeConfirmModal')
		const assTagsList=['客户', '供应商', '职员', '项目', '部门']
		const assList = []
		assTags.toJS().forEach((e,i)=>{
			if(assTagsList.indexOf(e)<0) {
				assList.push(e)
			}
		})
		const assListSelect = assList.map(u => ({
            key: u,
            value: u
        }))
		return (
			<Container className="ass-reverse">
                <InfoConfirm
                    reversAss={reversAss}
                    dispatch={dispatch}
                    assMessage={assMessage}
                    showReversModal={showReversModal}
					history={history}
					oldName={oldName}
					newName={newName}
					ifAssConfig={ifAssConfig}
				/>
				<AssTypeChangeConfirm
					showAssTypeChangeConfirmModal={showAssTypeChangeConfirmModal}
					dispatch={dispatch}
					oldName={oldName}
					newName={newName}
					history={history}
				/>
				<Row className="ac-config-title">
					<div
						className={ifAssConfig?'select':''}
						onClick={()=>{
                          dispatch(assconfigActions.changeAssConfigShowType())
						}}
					>修改核算对象编码</div>
					<div
						className={ifAssConfig?'':'select'}
						onClick={()=>{
						dispatch(assconfigActions.changeAssConfigShowType())
						}}
					>修改辅助类别名称</div>
				</Row>
                <ScrollView flex="1" uniqueKey="as-reverse-scroll" savePosition>
					{ifAssConfig ? <Form>
						<Item label="辅助类别：" className="form-offset-up">
							<SinglePicker
								className="info-select"
								district={assTagsSelect}
								onOk={(result) => dispatch(assconfigActions.changeReversAssCategory(result.value))}
							>
								<span className="info-select-text">
									{reversAss.get('assCategory')}<Icon type="arrow-right" className="ac-reverse-icon"/>
								</span>

							</SinglePicker>
                            {/* <Select
                                className="info-select"
                                source={assTagsSelect}
                                text={reversAss.get('assCategory')}
                                onOk={(result) => dispatch(assconfigActions.changeReversAssCategory(result.value))}
                            /> */}
						</Item>
						<Item label="核算对象：" className="form-offset-up form-offset-margin">
							{
								reversAss.get('assCategory') ?
								<SinglePicker
									className="info-select"
									district={asslistSelect}
									onOk={(result) => {
										const info = result.value.split(Limit.TREE_JOIN_STR)
										dispatch(assconfigActions.checkReversAssIdFetch(reversAss.get('assCategory'), info[0], info[1]))
									}}
								>
									<span className="info-select-text">
										{reversAss.get('assName')} <Icon type="arrow-right" className="ac-reverse-icon"/>
									</span>
								</SinglePicker> : ''
							}

                            {/* <Select
                                className="info-select"
                                source={asslistSelect}
                                text={reversAss.get('assName')}
                                onOk={(result) => {
                                    const info = result.value.split(Limit.TREE_JOIN_STR)
                                    dispatch(assconfigActions.checkReversAssIdFetch(reversAss.get('assCategory'), info[0], info[1]))
                                }}
                            /> */}
						</Item>
                        <div className="ass-reverse-info-tit" style={{display: reversAss.get('oldAssId') ? '' : 'none'}}><span>信息填写</span></div>
                        <Item label="原编码：" className="form-offset-up form-offset-margin" style={{display: reversAss.get('oldAssId') ? '' : 'none'}}>
                            <span>{reversAss.get('oldAssId')}</span>
						</Item>
                        <Item label="新编码：" className="form-offset-up form-offset-margin" style={{display: reversAss.get('oldAssId') ? '' : 'none'}}>
                            <TextInput
                                className="ac-kmset-item-input"
                                type="text"
                                placeholder={'填写编码 (限16位数字字母)'}
                                value={reversAss.get('assId')}
                                onChange={value => {
									if (/^[A-Za-z0-9]*$/g.test(value)) {
										if(value.length > Limit.CODE_LENGTH){
											return showMessage('', '', '', `辅助核算编码位数不能超过${Limit.ALL_NAME_LENGTH}位`)
										}

										dispatch(assconfigActions.changeReversNewAssId(value))

										if (asslist.some(v => v.get('assid') === value)) {
											this.setState({showInfo: true})
											// showMessage('', '', '', '辅助类别下该编码已存在')
										} else {
											this.setState({showInfo: false})
										}

									}
								}}
                            />
                            <Icon type="arrow-right" className="ac-reverse-icon"/>
						</Item>
						<div className="ass-reverse-info-tip" style={{display: showInfo ? '' : 'none'}}>
							<span className="reverse-item-icon">辅助类别下该编码已存在</span>
						</div>
                        <div className="ass-reverse-show" style={{display: reversAss.get('oldAssId') ? '' : 'none'}}>
                            <div>该核算对象已使用的内容</div>
                            <ul className="ass-tip">
                                {
                                    assMessage.map(u => <li className="ass-tip-item">{u === 'vc' ? '有相关的凭证' : u}</li>)
                                }
                            </ul>
                        </div>
                        <div className="ass-reverse-bottom" style={{display: reversAss.get('oldAssId') ? '' : 'none'}}>将统一修改以上内容的核算对象编码</div>
					</Form>
					:
					<Form>
						<Item label="辅助类别：" className="form-offset-up">
							<SinglePicker
								className="info-select"
								placeholder='请选择辅助类别'
								extra='请选择辅助类别'
								district={assListSelect}
								onOk={(result) => dispatch(assconfigActions.changeAssConfigOldName(result.value))}
							>
								<span className="info-select-text">
									{oldName}<Icon type="arrow-right" className="ac-reverse-icon"/>
								</span>
							</SinglePicker>
						</Item>
						<Item label="修改后名称：" className="form-offset-up form-offset-margin">
							<TextInput
								className="ac-kmset-item-input"
								type="text"
								placeholder={'请输入'}
								value={newName}
								onChange={value => {
									if (configCheck.hasChiness(value)) {
										return showMessage('', '', '', `名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
									}
									dispatch(assconfigActions.changeAssConfigNewName(value))
								}}
							/>
						</Item>
					</Form>
				}
				</ScrollView>
					{ifAssConfig ? <ButtonGroup type='ghost' height={50}>
						<Button onClick={() => history.goBack()}><Icon type="cancel"/><span>取消</span></Button>
						<Button disabled={reversAss.get('oldAssId') ? false : true} onClick={() => {
							if (!reversAss.get('assId')) {
								return showMessage('', '', '', '未填写新编码')
							}
							if (showInfo) {
								return showMessage('', '', '', '新编码已存在，不可修改')
							}
							dispatch(assconfigActions.showReversConfirmModal(true))
						}}><Icon type="save"/><span>信息确认</span></Button>
					</ButtonGroup>:
					<ButtonGroup type='ghost' height={50}>
						<Button onClick={() => history.goBack()}><Icon type="cancel"/><span>取消</span></Button>
						<Button disabled={newName===''||oldName===''} onClick={() => {
							if(assList.includes(newName)||assTagsList.includes(newName)){
								return showMessage('', '', '', '已存在同名的辅助类别')
							}else{
								dispatch(assconfigActions.showReversConfirmModal(true))
							}
						}}><Icon type="save"/><span>信息确认</span></Button>
					</ButtonGroup>}

			</Container>
		)
	}
}
