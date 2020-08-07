import React, { PropTypes }	from 'react'
import { Map, toJS } from 'immutable'
import { connect }	from 'react-redux'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import { Button, ButtonGroup, Icon, Container, Row, ScrollView, Form, AmountInput, TextInput } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import * as thirdParty from 'app/thirdParty'
import AcShow from './AcShow.jsx'
import InfoAffirms from './InfoAffirms.jsx'

import './ac-reverse.less'
import { formatMoney } from 'app/utils'
const {
	Label,
	Control,
	Item
} = Form

@connect(state => state)
export default
class ReversAcEdit extends React.Component {

	componentDidMount() {
		thirdParty.setTitle({title: '反悔模式'})
		thirdParty.setRight({show: false})
	}

	render() {
		const {
			allState,
			acconfigState,
			dispatch,
            history
		} = this.props

        const reverseTitleName = acconfigState.get('reverseTitleName')
        const reverseTitleIndex = acconfigState.get('reverseTitleIndex')
		const type = acconfigState.get('type')
		const reverseAc = acconfigState.get('reverseAc')
		const revenseAcid = reverseAc.get('acid')
		const revenseAcname = reverseAc.get('acname')
		const acid = reverseAc.get('acid')
		const isSelect = acconfigState.get('isSelect')
		const NewAcReverseId = acconfigState.get('NewAcReverseId')
		const NewAcReverseName = acconfigState.get('NewAcReverseName')
		const idNewAcReverseId = acconfigState.get('idNewAcReverseId')
		const canChangeClassId = acconfigState.get('canChangeClassId')
		const showInfoAffirmStatus = acconfigState.get('showInfoAffirmStatus')

		const category = reverseAc.get('category')
		const upAcName = reverseAc.get('upAcName')
		const direction = reverseAc.get('direction')
		const upperId = reverseAc.get('upperId')
		const acunitOpen = reverseAc.get('acunitOpen')
		const cardNum = reverseAc.get('cardNum')
		const hasChildren = reverseAc.get('hasChildren')
		const categoryList = reverseAc.get('categoryList')
		const acCount = reverseAc.get('acCount')
		const openingbalance = reverseAc.get('openingbalance')

		return (
			<Container  className="ac-reverse">
				<InfoAffirms
					allState={allState}
					acconfigState={acconfigState}
					dispatch={dispatch}
					showInfoAffirmStatus={showInfoAffirmStatus}
					history={history}
				/>
				<Row className="ac-config-title">
					{reverseTitleName.map((v, i) => {
						return (
							<div
								key={i}
								className={reverseTitleIndex === i ? 'select' : ''}
								onClick={()=>{
									dispatch(acconfigActions.changeReverseTit(i))
								}}
							>{v}</div>
						)
					})}
				</Row>
                <ScrollView flex="1" uniqueKey="ac-reverse-scroll" savePosition>

					<ul className="form-tip ac-kmset-tip">
						<li className="form-tip-item">{type === 'class' ? '已有数据的科目新增子级科目' : '已有数据的科目修改科目编码'}</li>
					</ul>
					<div
						className="ac-kmset-item"
						onClick={() => {
							history.push('/reverse/reversselect')
						}}
						>
						<label>科目选择：</label>
						<span><span className="ac-kmset-acid">{revenseAcid ? revenseAcid+' '+revenseAcname : ''}</span><Icon type="arrow-right" className="ac-reverse-icon"/></span>
					</div>

					{
						type === 'class' ?
						(<div className="ac-kmset">
							<div className="ac-kmset-info"
								style={{display: isSelect && type === 'class' ? '' : 'none' }}
								>
								<div className="ac-kmset-info-tit"><span>信息填写</span></div>
								<Form>
									<Item label="新增下级科目编码：" className="form-offset-up">
										<span  className="ac-kmset-newId">
											<span>{revenseAcid}</span>
											{/* <input
												className="ac-kmset-item-input"
												type="text"
												value={NewAcReverseId}
												onChange={(e) => dispatch(acconfigActions.createNewAcId(e.target.value, revenseAcid))}
											/> */}
											<span className="ac-kmset-item-input-wrap">
												<AmountInput
													className="ac-kmset-item-input"
													type="text"
													value={NewAcReverseId}
													onChange={value => dispatch(acconfigActions.createNewAcId(value, revenseAcid))}
												/>
											</span>
										</span>
										<Icon type="arrow-right" className="ac-reverse-icon"/>
									</Item>
									<Item label="新增下级科目名称：" className="form-offset-up form-offset-margin form-offset-border">
										<TextInput
											textAlign="right"
											className="ac-kmset-item-input"
											type="text"
											placeholder={`包含中文最长${Limit.AC_CHINESE_NAME_LENGTH}个字符，否则最长${Limit.AC_NAME_LENGTH}个`}
											value={NewAcReverseName}
											onChange={value => {
												// if(e.target.value.length > Limit.ALL_NAME_LENGTH){
												// 	return thirdparty.toast({icon: '', text: `科目名称字数不能超过${Limit.ALL_NAME_LENGTH}位`})
												// }

												dispatch(acconfigActions.createNewAcName(value))
											}}
										/>
										<Icon type="arrow-right" className="ac-reverse-icon"/>
									</Item>
								</Form>
								{/* <div className="ac-kmset-item">
									<label>新增下级科目编码：</label>
			                        <span  className="ac-kmset-newId">
										<span>{revenseAcid}</span>
										<input
											className="ac-kmset-item-input"
											type="text"
											value={NewAcReverseId}
											onChange={(e) => dispatch(acconfigActions.createNewAcId(e.target.value, revenseAcid))}
										/>
									</span>
									<Icon type="arrow-right"  style={{color:'#CCCCCC'}}/>
								</div>
								<div className="ac-kmset-item">
									<label>新增下级科目名称：</label>
			                        <span>
										<input
											className="ac-kmset-item-input"
											type="text"
											placeholder="填写名称 (最长20个字符)"
											value={NewAcReverseName}
											onChange={e => {
												if(e.target.value.length > Limit.ALL_NAME_LENGTH){
													return thirdparty.toast({icon: '', text: `科目名称字数不能超过${Limit.ALL_NAME_LENGTH}位`})
												}

												dispatch(acconfigActions.createNewAcName(e.target.value))
											}}
										/>
									</span>
									<Icon type="arrow-right" style={{color:'#CCCCCC'}}/>
								</div> */}
								<AcShow
									categoryList={categoryList}
									openingbalance={openingbalance}
									acunitOpen={acunitOpen}
									cardNum={cardNum}
									acCount={acCount}
									hasChildren={hasChildren}
								/>
								<ul className="form-tip">
									<li className="form-tip-item">
										以上内容将转移至新增下级科目中；
									</li>
									<li className="form-tip-item">
										子科目将自动继承上级科目的余额方向、类别；
									</li>
								</ul>
							</div>
						</div>)
						:
						(<div className="ac-kmset">
							<div className="ac-kmset-info"
								style={{display: isSelect && type === 'id' ? '' : 'none' }}
								>
								<div className="ac-kmset-info-tit"><span>信息填写</span></div>
								<Form>
									<Item label="科目编码修改为：" className="form-offset-up">
										<span  className="ac-kmset-newId">
											<span className="ac-kmset-changeId">{upperId}</span>
											<span className="ac-kmset-item-input-wrap">
												<AmountInput
													className="ac-kmset-item-input"
													type="text"
													value={idNewAcReverseId}
													onChange={value => {
														const id = value

														var re = eval("/^[0-9]*$/g")
														if (revenseAcid.length === 4) {
															if (re.test(id) && id.length < 4) {
																dispatch(acconfigActions.changeIdNewAcReverseId(id))
																if (id.length === 3) {
																	dispatch(acconfigActions.getAcIdReverseAble(revenseAcid, upperId+''+id))
																}
															}
														} else {
															if (re.test(id) && id.length < 3) {
																dispatch(acconfigActions.changeIdNewAcReverseId(id))
																if (id.length === 2) {
																	dispatch(acconfigActions.getAcIdReverseAble(revenseAcid, upperId+''+id))
																}
															}
														}

													}}
												/>
											</span>
										</span>
										<Icon type="arrow-right" className="ac-reverse-icon"/>
									</Item>
									<Item label="上级科目：" className="form-offset-up  form-offset-margin">
										<span className="ac-kmset-item-color">{upAcName ? `${upperId}_${upAcName}` : '无'}</span>
									</Item>
									<Item label="科目类别：" className="form-offset-up  form-offset-margin">
										<span className="ac-kmset-item-color">{category}</span>
									</Item>
									<Item label="余额方向：" className="form-offset-up form-offset-margin">
										<span className="ac-kmset-item-color">{isSelect ? (direction == 'credit' ? '贷' : '借') : ''}</span>
									</Item>
									<Item label="数量核算：" className="form-offset-up form-offset-margin  form-offset-border">
										<span className="ac-kmset-item-color">{isSelect ? (acunitOpen == '0' ? '无' : '有') : ''}</span>
									</Item>
								</Form>

								{/* <div className="ac-kmset-item">
									<label>科目编码修改为：</label>
			                        <span  className="ac-kmset-newId">
										<span className="ac-kmset-changeId">{upperId}</span>
										<input
											className="ac-kmset-item-input"
											type="text"
											value={idNewAcReverseId}
											onChange={(e) => {
												const id = e.target.value

												var re = eval("/^[0-9]*$/g")
												if (revenseAcid.length === 4) {
													if (re.test(id) && id.length < 4) {
														dispatch(acconfigActions.changeIdNewAcReverseId(id))
														if (id.length === 3) {
															dispatch(acconfigActions.getAcIdReverseAble(revenseAcid, upperId+''+id))
														}
													}
												} else {
													if (re.test(id) && id.length < 3) {
														dispatch(acconfigActions.changeIdNewAcReverseId(id))
														if (id.length === 2) {
															dispatch(acconfigActions.getAcIdReverseAble(revenseAcid, upperId+''+id))
														}
													}
												}

											}}
										/>
									</span>
									<Icon type="arrow-right"  style={{color:'#CCCCCC'}}/>
								</div>
								<div className="ac-kmset-item">
									<label>上级科目：</label>
			                        <span>{upAcName ? `${upperId}_${upAcName}` : '无'}</span>
								</div>
								<div className="ac-kmset-item">
									<label>科目类别：</label>
			                        <span>{category}</span>
								</div>
								<div className="ac-kmset-item">
									<label>余额方向：</label>
			                        <span>{isSelect ? (direction == 'credit' ? '贷' : '借') : ''}</span>
								</div>
								<div className="ac-kmset-item">
									<label>数量核算：</label>
			                        <span>{isSelect ? (acunitOpen == '0' ? '无' : '有') : ''}</span>
								</div> */}
								<AcShow
									categoryList={categoryList}
									openingbalance={openingbalance}
									acunitOpen={acunitOpen}
									cardNum={cardNum}
									acCount={acCount}
									hasChildren={hasChildren}
								/>
								<ul className="form-tip">
									<li className="form-tip-item">以上内容将转移至新增科目中，原科目将被删除</li>
								</ul>
							</div>
						</div>)
					}

                </ScrollView>
                <Row>
					<ButtonGroup type='ghost'>
						<Button onClick={() => dispatch(acconfigActions.cancelReverse(history))}><Icon type="cancel"/>取消</Button>
						<Button style={{display: isSelect && type === 'class' ? '' : 'none'}}
							onClick={() => {
								if (NewAcReverseId.length < 2) {
									return thirdParty.toast.info(`科目编码的长度应为${NewAcReverseId.length+2}`)
								}

								if (NewAcReverseName === '') {
									return thirdParty.toast.info('科目名称不能为空')
								}

								const isChinese = /[\u4e00-\u9fa5]/g
								const isChineseSign = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g
								// ： 。 ；  ， ： “ ”（ ） 、 ？ 《 》

								let acnameLimitLength = Limit.AC_CHINESE_NAME_LENGTH
								if (!isChinese.test(NewAcReverseName) && !isChineseSign.test(NewAcReverseName)) {
									acnameLimitLength = Limit.AC_NAME_LENGTH
								}
								if (NewAcReverseName.length > acnameLimitLength){
									return thirdParty.Alert(`科目名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；否则，长度不能超过${Limit.AC_NAME_LENGTH}位`)
								}
								
								dispatch(acconfigActions.showInfoAffirm(true))
								// history.push('/config/reverse/infoaffirm')
							}}
							>
								<Icon type="confirm"/>信息确认
						</Button>
						<Button style={{display: isSelect && type === 'id' && canChangeClassId === 'true' ? '' : 'none'}}
							onClick={() => {
								// history.push('/config/reverse/infoaffirm')
								dispatch(acconfigActions.showInfoAffirm(true))
							}}
							>
								<Icon type="confirm"/>信息确认
						</Button>
					</ButtonGroup>
				</Row>
			</Container>
		)
	}
}
