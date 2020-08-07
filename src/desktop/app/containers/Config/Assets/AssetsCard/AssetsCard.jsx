import React from 'react'
import { connect } from 'react-redux'
import { fromJS, toJS } from 'immutable'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

import SelectAc from '../AssetsCategory/SelectAc'
import SelectAss from '../AssetsCategory/SelectAss'
import Delete from '../common/Delete'
import { Button, Input, Select, DatePicker, Modal, message } from 'antd'
import { judgePermission } from 'app/utils'
import moment from 'moment'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
import { nameCheck } from 'app/utils'
const Option = Select.Option
import './style.less'

const dateFormat = 'YYYY/MM/DD'

@connect(state => state)
export default
class AssetsCard extends React.Component {

	constructor() {
		super()
		this.state = {modalVisible: false, copyNum: '', newLablemodal: false, newLable: '',newCardTotalMonth:false}
	}

	shouldComponentUpdate(nextprops, nextstate) {
		return this.props.allState != nextprops.allState || this.props.assetsState != nextprops.assetsState || this.state !== nextstate || this.props.homeState != nextprops.homeState
	}

    render() {

        const { assetsState, dispatch, allState, homeState } = this.props
		const { modalVisible, copyNum, newLablemodal, newLable, newCardTotalMonth } = this.state
		//权限修改
		const CUD_ASSETS_CARD = homeState.getIn(['data','userInfo','pageController','MANAGER','preDetailList','ASSETS_SETTING','detailList','CUD_ASSETS_CARD'])
		const detailList = homeState.getIn(['data','userInfo','pageController','MANAGER','preDetailList','ASSETS_SETTING','detailList'])
		// const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])

		const lrAclist = allState.get('lrAclist')
		const allasscategorylist = allState.get('allasscategorylist')

		const assetslist = assetsState.get('assetslist')
		const assetsSelectList = assetslist.filter(v => v.get('serialNumber').length === 1)
		const assetsClassSelectList = assetslist.filter(v => v.get('serialNumber').length === 3)

		const cardTemplate = assetsState.get('cardTemplate')
		const assetsCardMode = assetsState.getIn(['flags', 'assetsCardMode'])

		const serialNumber = cardTemplate.get('serialNumber')
		const cardNumber = cardTemplate.get('cardNumber')
		const cardName = cardTemplate.get('cardName')
		const assetsName = cardTemplate.get('assetsName')
		const assetsNumber = cardTemplate.get('assetsNumber')
		const classificationName = cardTemplate.get('classificationName')
		const classificationNumber = cardTemplate.get('classificationNumber')
		const remark = cardTemplate.get('remark')

		const label = cardTemplate.get('label').toJS()

		const startTime = cardTemplate.get('startTime')
		const inputPeriod = cardTemplate.get('inputPeriod')
		const depreciationMethod = cardTemplate.get('depreciationMethod')
		const totalMonth = cardTemplate.get('totalMonth')

		const debitId = cardTemplate.get('debitId')
		const debitName = cardTemplate.get('debitName')
		const debitAssList = cardTemplate.get('debitAssList')

		const creditId = cardTemplate.get('creditId')
		const creditName = cardTemplate.get('creditName')
		const creditAssList = cardTemplate.get('creditAssList')

		const selectLables = assetsState.getIn(['flags', 'selectLables'])

		const deleteModalStatus=assetsState.getIn(['view','deleteModalStatus'])

		const avtiveItemId=[cardNumber]
		const currentSelectedKeys = assetsState.get('currentSelectedKeys').toJS()[0]

		const cardValue = cardTemplate.get('cardValue')
		const salvage = cardTemplate.get('salvage')
		let residualValue = cardTemplate.get('residualValue')
		let monthlyDepreciation = cardTemplate.get('monthlyDepreciation')
		let alreadyDepreciationTime = cardTemplate.get('alreadyDepreciationTime')
		let sumDepreciation = cardTemplate.get('sumDepreciation')
		let earlyNetWorth = cardTemplate.get('earlyNetWorth')
		const status = cardTemplate.get('status')
		const currentCardTime = cardTemplate.get('currentCardTime')

		const statusText = ({'0': () => '正常使用', '1': () => '清理中', '2': () => '已清理', '3': () => '折旧完毕', '4': () => '已删除'}[status || ''])()

		// 计算预计残值
		residualValue = cardValue !== '' && salvage !== '' ? (cardValue * salvage / 100).toFixed(2) - 0 : ''

		// 计算月折旧（保留2位小数,向下取2位 如 10.6399 取 10.63）
		// monthlyDepreciation = cardValue !== '' && residualValue !== '' && totalMonth ? ((cardValue - residualValue) / totalMonth).toFixed(2) - 0 : ''
		monthlyDepreciation = cardValue !== '' && residualValue !== '' && totalMonth ?
		(Math.floor(((cardValue - residualValue) * 10000 / totalMonth)/100)/100)
		: ''

		// 计算已折旧期间
		// 资产明细有相同逻辑需修改
		alreadyDepreciationTime = getAlreadyDepreciationTime(startTime, inputPeriod, totalMonth, currentCardTime)
		function getAlreadyDepreciationTime(startTime, inputPeriod, totalMonth, currentCardTime) {

			inputPeriod = currentCardTime ? currentCardTime : inputPeriod
			let alreadyDepreciationTime = ''
			if (startTime && inputPeriod) {
				const startTimeYear = Number(startTime.substr(0, 4))
				const startTimeMonth = Number(startTime.substr(5, 2))
				const inputPeriodYear = Number(inputPeriod.substr(0, 4))
				const inputPeriodMonth = Number(inputPeriod.substr(6, 2))

				if (inputPeriodMonth < startTimeMonth) {
					alreadyDepreciationTime = (inputPeriodYear - startTimeYear) * 12 - (startTimeMonth - inputPeriodMonth) - 1
				} else {
					alreadyDepreciationTime = (inputPeriodYear - startTimeYear) * 12 + (inputPeriodMonth - startTimeMonth) - 1
				}

				if (alreadyDepreciationTime < 0) {
					return 0
				} else if (alreadyDepreciationTime <= totalMonth) {
					return alreadyDepreciationTime
				} else {
					return totalMonth
				}
			} else {
				return ''
			}
		}

		// 计算期初累计折旧
		sumDepreciation = getSumDepreciation (monthlyDepreciation, alreadyDepreciationTime)
		function getSumDepreciation (monthlyDepreciation, alreadyDepreciationTime) {
			if (monthlyDepreciation && alreadyDepreciationTime) {
				if (alreadyDepreciationTime == totalMonth && cardValue !== '' && salvage !== '') {
					return (cardValue - (cardValue * salvage)/100).toFixed(2) - 0
				} if (alreadyDepreciationTime * monthlyDepreciation < 0) {
					return 0
				} else {
					return (alreadyDepreciationTime * monthlyDepreciation).toFixed(2) - 0
				}
			} else {
				return 0
			}
		}

		// 计算期初净值
		earlyNetWorth = cardValue && sumDepreciation !== '' ? (cardValue - sumDepreciation).toFixed(2) - 0 : ''

		const showAssetsCard = assetsState.getIn(['flags', 'showAssetsCard'])
		// 判断卡片是否已结账
		const period = allState.get('period')
		const openedyearStr = period.get('openedyear')
		const openedmonthStr = period.get('openedmonth')
		const openedyear = Number(openedyearStr)
		const openedmonth = Number(openedmonthStr)
		const inputPeriodYear = Number(inputPeriod.substr(0,4))
		const inputPeriodMonth = Number(inputPeriod.substr(6,2))
		const closeStatus = (openedyear > inputPeriodYear) || (openedyear >= inputPeriodYear && openedmonth > inputPeriodMonth) ? true : false

		return (
			<Modal
				ref="modal"
				width='820px'
				visible={showAssetsCard}
				title={assetsCardMode === 'insert' ? '新增资产卡片' : '编辑资产卡片'}
				onCancel={()=> dispatch(assetsActions.showAssetsCard(false))}
				footer={[
					<Delete
						// configPermissionInfo={configPermissionInfo}
						disabledFlag={judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled}
						key="delete"
						froms='cardBomb'
						// disabled={!configPermissionInfo.getIn(['edit', 'permission']) || assetsCardMode === 'insert' || status === '2'}
						disabled={ judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled || assetsCardMode === 'insert' || status === '2'}
						ButtonClick={() => dispatch(assetsActions.showDeleteModal())}
						visible={deleteModalStatus}
						tipText='删除的卡片将不可恢复，请确认是否继续删除'
						onOk={() => dispatch(assetsActions.deleteCard(avtiveItemId, currentSelectedKeys))}
						onCancel={() => dispatch(assetsActions.closeDeleteModal())}
					/>,
					<Button
						key="clear"
						style={{marginLeft: '8px'}}
						disabled={judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled || assetsCardMode === 'insert' || (['0', '1', '3'].indexOf(status) === -1)}
						type="ghost"
						onClick={() => {
							if (status === '0') {
								dispatch(assetsActions.clearCardFetch('1', cardNumber, openedyearStr, openedmonthStr))
							} else if(status === '1') {
								dispatch(assetsActions.cancelClearCard('0', cardNumber))
							} else if(status === '3') {
								dispatch(assetsActions.clearCardFetch('1', cardNumber, openedyearStr, openedmonthStr))
							}
						}}>
							{status === '1' ? '取消清理' : '清理'}
					</Button>,
					// <Button
					// 	key="fefresh"
					// 	disabled={assetsCardMode === 'insert'}
					// 	type="ghost"
					// 	onClick={() => {
					// 		dispatch(assetsActions.getCardDetailFetch(cardNumber))
					// 	}}>
					// 	刷新
					// </Button>,
					<Button
						key="copy"
						disabled={judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled || assetsCardMode === 'insert'}
						type="ghost"
						onClick={() => {
							this.setState({modalVisible: true})
							dispatch(assetsActions.getCardListFetch(currentSelectedKeys))
						}}>
						复制
					</Button>,
					// <Button
					// 	key="cancal"
					// 	type="ghost"
					// 	onClick={() => dispatch(assetsActions.showAssetsCard(false))}
					// 	>
					// 	取消
					// </Button>,
					<Button
						key="save"
						disabled={judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled}
						style={{display:judgePermission(detailList.get('CUD_ASSETS_CARD')).display?'':'none'}}
						type="ghost"
						onClick={() => {
							if(nameCheck(cardName)){
								return message.warn(`卡片名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
							}
							dispatch(assetsActions.enterCard(residualValue, monthlyDepreciation, alreadyDepreciationTime, sumDepreciation, earlyNetWorth, currentSelectedKeys))}}
						>
						保存
					</Button>,
					<Button
						key="saveAndAdd"
						disabled={judgePermission(detailList.get('CUD_ASSETS_CARD')).disabled}
						type="primary"
						onClick={() => {
							if(nameCheck(cardName)){
								return message.warn(`卡片名称包含中文及中文标点字符，长度不能超过${Limit.AC_CHINESE_NAME_LENGTH}位；不包含中文及中文标点字符，长度不能超过${Limit.AC_NAME_LENGTH}位`)
							}
							dispatch(assetsActions.enterCard(residualValue, monthlyDepreciation, alreadyDepreciationTime, sumDepreciation, earlyNetWorth, currentSelectedKeys, 'saveAndNew'))}}
						>
						保存并新增
					</Button>
				]}>
				<div className='modalBomb assets-card-modalBomb' style={{display: modalVisible ? '' : 'none'}}>
					<Modal
						visible={modalVisible}
						title={'复制并新增卡片'}
						width={'420px'}
						style={{paddingTop: '100px'}}
						onCancel={() => {
							this.setState({copyNum: ''})
							this.setState({modalVisible: false})
						}}
						footer={[
							<Button
								key="cancel"
								type='ghost'
								onClick={() => {
									this.setState({copyNum: ''})
									this.setState({modalVisible: false})
								}}>
								取消
							</Button>,
							<Button
								key="ok"
								onClick={() => {
									if (copyNum > 100) {
										thirdParty.Alert('单次可复制张数小于等于100张')
									} else {
										dispatch(assetsActions.copyCardFetch(copyNum, currentSelectedKeys))
										this.setState({modalVisible: false})
										this.setState({copyNum: ''})
									}
								}}>
								复制
							</Button>
						]}
						>
						<div>复制卡片的数量:</div>
						<Input value={copyNum} placeholder="请输入复制的张数" onChange={e => {
							const { value } = e.target;
							const reg = /^[0-9]*$/g;

							if ((!isNaN(value) && reg.test(value)) || value === '' ) {
								this.setState({copyNum: value})
							}
						}}/>
					</Modal>
				</div>
				<div className='modalBomb' style={{display: newLablemodal ? '' : 'none'}}>
					<Modal
						visible={newLablemodal}
						title={'新增标签'}
						width={'420px'}
						style={{paddingTop: '100px'}}
						onCancel={() => {
							this.setState({newLable: ''})
							this.setState({newLablemodal: false})
						}}
						footer={[
							<Button
								key="saveandmore"
								disabled={newLable.length === 0}
								type='primary'
								onClick={() => {
									if (newLable.length > Limit.ALL_NAME_LENGTH) {
										return message.warn(`标签位数不能超过${Limit.ALL_NAME_LENGTH}位`)
									} else if (newLable.length && newLable.trim() == '') {
										return message.warn(`标签不能全为空格`)
									}
									this.setState({newLable: ''})
									this.setState({newLablemodal: false})
									dispatch(assetsActions.addNewCardLable(newLable))
								}}>
								保存  
							</Button>
						]}
						>
						<div>新增标签(未被使用过的标签将不再显示，请在使用该标签时新增):</div>
						<Input value={newLable} onChange={(e) => {
							this.setState({newLable: e.target.value})
						}}/>
					</Modal>
				</div>
				<span style={{display: assetsCardMode === 'modify' ? '' : 'none'}} className="assets-card-statu">{statusText}</span>
				<div className="assetsCard">
					<h4 className="assets-card-title">基本信息：</h4>
					<ul className="assets-card-section assets-card-width1">
						<li>
							<span>卡片编码：</span>
							<span>
								<Input
									disabled={closeStatus ? true : false}
									className="assets-card-input"
									value={cardNumber}
									onChange={(e) => {
										dispatch(assetsActions.changeCardCardNumber(e.target.value))
									}}
									onBlur={e => {
										if (e.target.value.length < 4 && e.target.value !== '') {
											const newNunber = '0000'.substr(0, 4-e.target.value.length)+e.target.value
											dispatch(assetsActions.changeCardCardNumber(newNunber))
										}
									}}
								/>
							</span>
						</li>
						<li>
							<span>卡片名称：</span>
							<span>
								<Input
									className="assets-card-input"
									placeholder="必填，请输入卡片名称"
									value={cardName}
									onChange={(e) => {
										dispatch(assetsActions.changeCardCardName(e.target.value))
									}}
								/>
							</span>
						</li>
					</ul>
					<ul className="assets-card-section assets-card-width1">
						<li>
							<span>资产分类：</span>
							<span className="assets-card-input">
								<Select
									disabled={closeStatus}
									className={assetsNumber ? `assets-card-select` : `assets-card-select assets-kmset-item-input-disabled`}
									searchPlaceholder="必填，请选择资产分类"
									value={assetsNumber ? assetsNumber + ' ' + assetsName : '必填，请选择资产分类'}
									onSelect={value => dispatch(assetsActions.selectCardAssetsOrClass(value, 'assets', assetsCardMode))}
									>
									{
										assetsSelectList.map((v, i) =>
											<Option key={i} value={`${v.get('serialNumber')} ${v.get('serialName')}`}>
												{`${v.get('serialNumber')} ${v.get('serialName')}`}
											</Option>
										)
									}
								</Select>
							</span>
						</li>
						<li>
							<span>辅助分类：</span>
							<span className="assets-card-input">
							{
								assetsNumber && assetsClassSelectList.filter(v => v.get('serialNumber').indexOf(assetsNumber) === 0).size && !closeStatus ?
								<Select
									className={classificationNumber ? `assets-card-select` : `assets-card-select assets-kmset-item-input-disabled`}
									value={classificationNumber ? classificationNumber + ' ' + classificationName : '必填，请选择资产辅助分类'}
									onSelect={value => dispatch(assetsActions.selectCardAssetsOrClass(value, 'class', assetsCardMode))}
									>
									{
										assetsClassSelectList.filter(v => v.get('serialNumber').indexOf(assetsNumber) === 0).map((v, i) =>
											<Option key={i} value={`${v.get('serialNumber')} ${v.get('serialName')}`}>
												{`${v.get('serialNumber')} ${v.get('serialName')}`}
											</Option>
										)
									}
								</Select> :
								<Input
									disabled={true}
									value={classificationNumber ? classificationNumber + ' ' + classificationName : ''}
								/>
							}
							</span>
						</li>
					</ul>
					<ul className="assets-card-section assets-card-width1">
						<li>
							<span>启用日期：</span>
							<span className="assets-card-input">
								{closeStatus ?
									<Input
										disabled={true}
										value={startTime.replace(/\D/g, '-')}
									/> :
									<DatePicker
										className="assets-card-input-date"
										placeholder="必填(必须比录入期间早或相等)"
										allowClear={false}
										value={startTime ? moment(startTime.replace(/\D/g, '/'), dateFormat) : ''}
										format={dateFormat}
										onChange={(value) => {
											if (!value) {
												dispatch(allActions.sendMessageToDeveloper({
													title: '资产卡片日期异常',
													message: `value:${value}, 卡片信息${JSON.stringify(cardTemplate)}`,
													remark: '资产卡片设置',
												}))
											} else {
												dispatch(assetsActions.changeCardStartTime(value, inputPeriod))
											}
										}}
									/>
								}
							</span>
						</li>
						<li>
							<span>录入期间：</span>
							<span>
								<Input
									disabled={true}
									className="assets-card-input"
									value={inputPeriod}
								/>
							</span>
						</li>
					</ul>
					<ul className="assets-card-section assets-card-width1 assets-card-margin">
						<li>
							<span>备注：</span>
							<span>
								<Input
									placeholder="选填，最多45个字符"
									value={remark}
									onChange={(e) => dispatch(assetsActions.changeCardRemark(e.target.value))}
								/>
							</span>
						</li>
						<li>
							<span>标&nbsp;&nbsp;&nbsp;签：</span>
							<span className="assets-card-input assets-card-label">
								<Select
									mode="multiple"
									multiple='true'
									className="assets-card-select-label"
									searchPlaceholder="可通过点击新增按钮新增标签"
									value={label}
									onChange={(value) => dispatch(assetsActions.changeCardLables(value))}
									>
									{selectLables.map((v, i) => <Option key={i} value={v}>{v}</Option>)}
								</Select>
								<Button
									className="assets-card-newlable"
									type='primary'
									onClick={() => this.setState({newLablemodal: true})}
									>
									新增标签
								</Button>
							</span>
						</li>
					</ul>
					<h4 className="assets-card-title">折旧／摊销方法：</h4>
					<ul className="assets-card-section assets-card-width2">
						<li>
							<span>折旧／摊销方法：</span>
							<span>
								<Input
									disabled={true}
									value={depreciationMethod}
								/>
							</span>
						</li>
						<li>
							<span>使用总期限（月）：</span>
							<span>
								<Input
									disabled={closeStatus ? true : false}
									value={totalMonth}
									placeholder="必填，请输入数字"
									onChange={(e) => {
										if(e.target.value > Limit.ASS_TOTAL_MONTH){
											this.setState({newCardTotalMonth: true})
											e.target.value='';
										}
										dispatch(assetsActions.changeCardTotalMonth(e.target.value))
									}}
								/>
							</span>
						</li>
						<Modal
							visible={newCardTotalMonth}
							title={'提示'}
							onCancel={() => {
								this.setState({newCardTotalMonth: false})
							}}
							footer={[
								<Button
									key="month"
									type='primary'
									onClick={() => {
										this.setState({newCardTotalMonth: false})
									}}>
									确定
								</Button>
							]}
							>
							<div>资产默认总期限不超过{Limit.ASS_TOTAL_MONTH}月</div>
						</Modal>
					</ul>
					<ul className="assets-card-section assets-card-width2">
						<li className="assets-card-ac-select-wrap">
							<div className="assets-card-ac-select">
								<div className="assets-card-select-item">
									<span className="assets-card-input-tip">账务处理借方科目：</span>
									<span className="assets-card-input">
										<SelectAc
											className="assets-card-select"
											tipText='必填，请选择科目'
											acId={debitId}
											acName={debitName}
											debitAssList={debitAssList}
											lrAclist={lrAclist}
											onChange={(value) => {
												const acid = value.split(' ')[0]
												const acItem = lrAclist.find(v => v.get('acid') === acid)
												dispatch(assetsActions.selectAssetsAc(acItem ? acid : '', acItem && acItem.get('acfullname'), acItem && acItem.get('asscategorylist'), 'cardTemplate', 'debit'))
											}}
										/>
									</span>
								</div>
								{
									debitAssList.size ?
									debitAssList.map((v, i) =>
										<div className="assets-card-select-item">
											<span className="assets-card-input-tip">{`辅助核算(${v.get('assCategory')}):`}</span>
											<span className="assets-card-input">
												<SelectAss
													className={"assets-card-select"}
													assid={v.get('assId') ? v.get('assId') : ''}
													assname={v.get('assName') ? v.get('assName') : ''}
													asscategory={v.get('assCategory')}
													allasscategorylist={allasscategorylist}
													onChange={(value) => {
														const assid = value.split(' ')[0]
														const assname = value.split(' ')[1]
														dispatch(assetsActions.selectAssetsAss(assid, assname, i, 'cardTemplate', 'debit'))
													}}
												/>
											</span>
										</div>
									) : ''
								}
							</div>
						</li>
						<li className='assets-card-ac-select-wrap'>
							<div className="assets-card-ac-select">
								<div className="assets-card-select-item">
								<span className="assets-card-input-tip">账务处理贷方科目：</span>
									<span className="assets-card-input">
										<SelectAc
											className="assets-card-select"
											tipText='必填，请选择科目'
											acId={creditId}
											acName={creditName}
											debitAssList={creditAssList}
											lrAclist={lrAclist}
											onChange={(value) => {
												const acid = value.split(' ')[0]
												const acItem = lrAclist.find(v => v.get('acid') === acid)
												dispatch(assetsActions.selectAssetsAc(acItem ? acid : '', acItem && acItem.get('acfullname'), acItem && acItem.get('asscategorylist'), 'cardTemplate', 'credit'))
											}}
										/>
									</span>
								</div>
								{
									creditAssList.size ?
									creditAssList.map((v, i) =>
										<div className="assets-card-select-item">
											<span className="assets-card-input-tip">{`辅助核算(${v.get('assCategory')}):`}</span>
											<span className="assets-card-input">
												<SelectAss
													className="assets-card-select"
													assid={v.get('assId') ? v.get('assId') : ''}
													assname={v.get('assName') ? v.get('assName') : ''}
													asscategory={v.get('assCategory')}
													allasscategorylist={allasscategorylist}
													onChange={(value) => {
														const assid = value.split(' ')[0]
														const assname = value.split(' ')[1]
														dispatch(assetsActions.selectAssetsAss(assid, assname, i, 'cardTemplate', 'credit'))
													}}
												/>
											</span>
										</div>
									) : ''
								}
							</div>
						</li>
					</ul>
					<h4 className="assets-card-title">原值、净值、累计折旧：</h4>
					<ul className="assets-card-section assets-card-width3">
						<li>
							<span>原值：</span>
							<span>
								<Input
									disabled={closeStatus ? true : false}
									className="assets-card-input"
									value={cardValue}
									placeholder="必填，请输入数字"
									onChange={e => dispatch(assetsActions.changeCardCardValue(e.target.value))}
								/>
							</span>
						</li>
						<li>
							<span>残值率（%）：</span>
							<span>
								<Input
									disabled={closeStatus ? true : false}
									className="assets-card-input"
									value={salvage}
									placeholder="必填，请输入小于100的数字"
									onChange={e => dispatch(assetsActions.changeCardSalvage(e.target.value))}
								/>
							</span>
						</li>
					</ul>
					<ul className="assets-card-section assets-card-width3">
						<li>
							<span>预计残值：</span>
							<span>
								<Input
									disabled={true}
									className="assets-card-input"
									value={residualValue}
								/>
							</span>
						</li>
						<li>
							<span>已折旧／摊销期间：</span>
							<span>
								<Input
									disabled={true}
									className="assets-card-input"
									value={alreadyDepreciationTime}
								/>
							</span>
						</li>
					</ul>
					<ul className="assets-card-section assets-card-width3">
						<li>
							<span>期初累计折旧／摊销：</span>
							<span>
								<Input
									disabled={true}
									className="assets-card-input"
									value={sumDepreciation}
								/>
							</span>
						</li>
						<li>
							<span>期初净值：</span>
							<span>
								<Input
									disabled={true}
									className="assets-card-input"
									value={earlyNetWorth}
								/>
							</span>
						</li>
					</ul>
					<ul className="assets-card-section assets-card-width3">
						<li style={{'paddingRight':0}}>
							<span>月折旧／摊销：</span>
							<span>
								<Input
									disabled={true}
									className="assets-card-input"
									value={monthlyDepreciation}
								/>
							</span>
						</li>
					</ul>
				</div>
			</Modal>
		)
	}
}
