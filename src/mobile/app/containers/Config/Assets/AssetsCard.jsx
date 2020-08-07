import React, { PropTypes } from 'react'
import { Map, fromJS } from 'immutable'
import { connect }	from 'react-redux'
import './Assets.less'
import { Container, ButtonGroup, Button, Icon, ScrollView, Row, Form, TextInput, DatePicker, SinglePicker } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import * as allActions from 'app/redux/Home/All/other.action'
import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import * as acconfigActions from 'app/redux/Config/Ac/acconfig.action'
import CardSelecter from './CardSelecter'
import LabelInput from './LabelInput'
import { selectAc, DateLib } from 'app/utils'
const {
	Label,
	Control,
	Item
} = Form

@connect(state => state)
export default
class AssetsCard extends React.Component {

    render() {
		const { assetsState, dispatch, allState, history, homeState } = this.props

		const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

		const assetsCardMode = assetsState.get('assetsCardMode')
		if (assetsCardMode === 'insert') {
			thirdParty.setTitle({title: '新增卡片'})
			thirdParty.setRight({show: false})
		} else if (assetsCardMode === 'modify') {
			thirdParty.setTitle({title: '修改卡片'})
			thirdParty.setRight({show: false})
		} else if (assetsCardMode === 'detail') {
			thirdParty.setTitle({title: '查看卡片'})

			// 资产卡片导出
			const ddExcelCallback = () => dispatch => dispatch(allActions.allExportDo('excelcard'))

			dispatch(allActions.navigationSetMenu('config', '', ddExcelCallback))
			// thirdparty.setRight({show: false})
		}

		const selectLabeListAllDisplay = assetsState.get('selectLabeListAllDisplay')
		const selectLabeList = assetsState.get('selectLabeList')
		const showSelectlabel = assetsState.get('showSelectlabel')
		const assetsCard = assetsState.get('card')
		const label = assetsCard.get('label')
		// console.log('card-content', assetsCard.toJS())
		const debitAssList = assetsCard.get('debitAssList')
		const creditAssList = assetsCard.get('creditAssList')
		const acasslist = allState.get('acasslist')
		const assetsNumber = assetsCard.get('assetsNumber')
		const debitId = assetsCard.get('debitId')
		const creditId = assetsCard.get('creditId')
		const cardValue = assetsCard.get('cardValue')
		const salvage = assetsCard.get('salvage')
		const totalMonth = assetsCard.get('totalMonth')
		const startTime = assetsCard.get('startTime')
		const inputPeriod = assetsCard.get('inputPeriod')
		const currentCardTime = assetsCard.get('currentCardTime')
		const remark = assetsCard.get('remark')
		let residualValue = assetsCard.get('residualValue')
		let monthlyDepreciation = assetsCard.get('monthlyDepreciation')
		let alreadyDepreciationTime = assetsCard.get('alreadyDepreciationTime')
		let sumDepreciation = assetsCard.get('sumDepreciation')
		let earlyNetWorth = assetsCard.get('earlyNetWorth')

		// 计算预计残值
		residualValue = cardValue !== '' && salvage !== '' ? (cardValue * salvage / 100).toFixed(2) - 0 : ''

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

		const assetslist = assetsState.get('assetslist') ? assetsState.get('assetslist') : fromJS([])
		const status = assetsCard.get('status')

		const assetsSelectlist = assetslist.filter(v => v.get('serialNumber').length === 1)
											.map(v => {return { value : v.get('serialNumber') + '_' + v.get('serialName'), key: v.get('serialNumber') + '_' + v.get('serialName')}})

		const classifiSelectlist = assetslist.filter(v => v.get('serialNumber').indexOf(assetsNumber) === 0 && v.get('serialNumber').length === 3)
											.map(v => {return { value : v.get('serialNumber') + '_' + v.get('serialName'), key: v.get('serialNumber') + '_' + v.get('serialName')}})

		function getSourceList (assCategory) {
			return acasslist.filter(v => v.get('asscategory') === assCategory).getIn([0, 'asslist']).filter(v => !v.get('disableTime'))
			.map(v => {return {value: `${v.get('assid')}_${v.get('assname')}`, key: `${v.get('assid')}_${v.get('assname')}`}})
		}

		// 卡片详情所需变量
        const serialNumber = assetsCard.get('serialNumber')
        const cardNumber = assetsCard.get('cardNumber')
        const cardDetailList = assetsState.get('cardDetailList')

		// 科目选择
		const cascadeDataAclist = allState.get('cascadeDataAclist')
		const aclist = allState.get('aclist')

		const isToday = new Date()
		const today = `${isToday.getFullYear()}-${isToday.getMonth() + 1 > 10 ?
						(isToday.getMonth() + 1) : '0' + (isToday.getMonth() + 1)}-${isToday.getDate() + 1 > 10 ? (isToday.getDate() + 1) :
						'0' + (isToday.getDate() + 1)}`

		const cardYear = inputPeriod.substr(0, 4)
		const cardMonth = inputPeriod.substr(6, 2)
		const compareyear = currentCardTime.substr(0, 4)
		const comparemonth = currentCardTime.substr(6, 2)

		const abledClick = cardYear > compareyear ? false : (cardMonth > comparemonth ? false : true)

		// 判断卡片是否已结账
		const period = allState.get('period')
		const openedyear = Number(period.get('openedyear'))
		const openedmonth = Number(period.get('openedmonth'))
		const inputPeriodYear = Number(inputPeriod.substr(0,4))
		const inputPeriodMonth = Number(inputPeriod.substr(6,2))
		const closeStatus = (openedyear > inputPeriodYear) || (openedyear >= inputPeriodYear && openedmonth > inputPeriodMonth) ? true : false

		const statusText = ({'0': () => '正常使用', '1': () => '清理中', '2': () => '已清理', '3': () => '折旧完毕', '4': () => '已删除'}[status || ''])()

        return (
            <Container className="assetscard">
				{/* 新增card的布局 */}
                <ScrollView ref="assetscard-scrollcopy" uniqueKey="assetscard-scroll" savePosition flex="1" style={{position: 'relative', display: assetsCardMode === 'detail' ? 'none' : ''}}>

                    <Form onClick={() => {
						dispatch(assetsActions.changeSelectLabelStatus(false))
						if (selectLabeListAllDisplay) {
							dispatch(assetsActions.changeSelectLabeListAllDisplay())
						}
					}}>
                        <div className="form-classify-head">基本信息</div>
                        <Item label="编码">
                            <TextInput
                                type="text"
								textAlign='right'
                                className="form-input"
                                // value={`${assetsCard.get('serialNumber')}${cardNumber}`}
								value={cardNumber}
								disabled={closeStatus}
								onChange={value => dispatch(assetsActions.changeCardNunber(value))}
								onBlur={value => {
									if (value.length < 4 && value !== '') {
										const newNunber = '0000'.substr(0, 4-value.length)+value
										dispatch(assetsActions.changeCardNunber(newNunber))
									}
								}}
                            />
                        </Item>
                        <Item label="名称" showAsterisk={true}>
                            <TextInput
                                type="text"
                                className="form-input"
								textAlign='right'
                                placeholder="名称填写..."
								value={assetsCard.get('cardName')}
								onChange={value => dispatch(assetsActions.changeCardName(value))}
                            />
							&nbsp;<Icon type='arrow-right' className="assets-item-color"/>
                        </Item>
                        <Item label="资产分类" showAsterisk={true}>
							{/* 选择 */}
							{/* <Select
								className="info-select"
								source={assetsSelectlist}
								text={assetsCard.get('assetsName') ? assetsCard.get('assetsName') : '选择'}
								onOk={(result) => dispatch(assetsActions.changeCardAssetsName(result.value))}
							/> */}
							{
								closeStatus ? <span>{assetsCard.get('assetsName')}</span>
								:
								<SinglePicker
									className="info-select"
									district={assetsSelectlist}
									onOk={(result) => dispatch(assetsActions.changeCardAssetsName(result.value))}
								>
									<span style={{color: assetsCard.get('assetsName') ? '#333' : '#999'}}>{assetsCard.get('assetsName') ? assetsCard.get('assetsName') : '选择'}</span>
								</SinglePicker>
								// {/* <Select
								// 	className="info-select"
								// 	source={assetsSelectlist}
								// 	text={assetsCard.get('assetsName') ? assetsCard.get('assetsName') : '选择'}
								// 	onOk={(result) => dispatch(assetsActions.changeCardAssetsName(result.value))}
								// 	style={{color: assetsCard.get('assetsName') ? '#333' : '#999'}}
								// /> */}
							}
                        </Item>
						<Item label="备注">
							<TextInput
								type="text"
								textAlign='right'
								className="form-input"
								placeholder="选填，请输入备注(最长45个字符)"
								value={assetsCard.get('remark')}
								onChange={value => dispatch(assetsActions.changeCardRemark(value))}
							/>
							&nbsp;<Icon type='arrow-right' className="assets-item-color"/>
                        </Item>
						{
							assetsCard.get('assetsName') && classifiSelectlist.size !== 0 ?
							<Item label="辅助分类" showAsterisk={true}>
								{
									closeStatus ? <span disabled>{assetsCard.get('assetsName')}</span>
									:
									<SinglePicker
										className="info-select"
										district={classifiSelectlist}
										onOk={(result) => dispatch(assetsActions.changeCardClassificationName(result.value))}
									>
										<span style={{color: assetsCard.get('classificationName') ? '#333' : '#999'}}>{assetsCard.get('classificationName') ? assetsCard.get('classificationName') : '选择'}</span>
									</SinglePicker>
									// <Select
									// 	className="info-select"
									// 	source={classifiSelectlist}
									// 	text={assetsCard.get('classificationName') ? assetsCard.get('classificationName') : '选择'}
									// 	onOk={(result) => dispatch(assetsActions.changeCardClassificationName(result.value))}
									// 	style={{color: assetsCard.get('classificationName') ? '' : '#999'}}
									// />
								}

							</Item>
							: ''
						}
						<LabelInput
							dispatch={dispatch}
							showSelectlabel={showSelectlabel}
							label={label}
							selectLabeList={selectLabeList}
							selectLabeListAllDisplay={selectLabeListAllDisplay}
							scrollViewRef={this.refs['assetscard-scrollcopy']}
						/>
                        <Item label="启用日期" showAsterisk={true}>
							{
								closeStatus ? <span disabled>{assetsCard.get('startTime') ? assetsCard.get('startTime').replace(/\D/g, '-') : ''}</span>
								:
								// 日期选择
								<DatePicker
									value={assetsCard.get('startTime') ? assetsCard.get('startTime').replace(/\D/g, '-') : today}
									onChange={(value) => {
										value = new DateLib(value).toString()
										dispatch(assetsActions.changeStartUseTime(value, assetsCard.get('currentCardTime')))
									}}
								>
									<span style={{color: assetsCard.get('startTime') ? '' : '#999'}}>
										{assetsCard.get('startTime') ? assetsCard.get('startTime') : '请选择日期'}
										<Icon type="triangle" className="assets-item-triangle"></Icon>
									</span>
								</DatePicker>
							}
                        </Item>
                        <Item label="录入期间" className="form-offset-border">
                            <span disabled>{assetsCard.get('inputPeriod')}</span>
                        </Item>
                        <div className="form-classify-head">折旧/摊销方法</div>
                        <Item label="折旧/摊销方法">
                            <TextInput
                                type="text"
								textAlign='right'
                                className="form-input"
                                value={assetsCard.get('depreciationMethod')}
                                disabled
                            />
                        </Item>
                        <Item label="使用总期限(月)" className="input-text-sign-box" showAsterisk={true}>
							{ closeStatus ? <span disabled style={{marginRight: '.2rem'}}>{assetsCard.get('totalMonth')}</span>
								:
								<TextInput
									type="number"
									textAlign='right'
									className="number-input-assets form-input input-text-sign"
									value={assetsCard.get('totalMonth')}
									onChange={value => dispatch(assetsActions.changeUseMonth(value))}/>
							}
                        </Item>
                        <Item
							className="input-ac-sign-box"
							label="账务处理借方科目"
							showAsterisk={true}
							onClick={() => {
								dispatch(assetsActions.assetsToAc('debit', 'card'))
								selectAc(cascadeDataAclist, aclist, (...value) => dispatch(assetsActions.assetsSelectAc(...value)))

								// history.push('/config/acassets/ac')
								// dispatch(acconfigActions.assetsToAc('debit', 'card'))
							}}>
							{
								debitId === '' ?
								// <span style={{color: '#999'}}>&nbsp;<Icon type='triangle' className="assets-item-color"/></span> :
								<span className="input-ac-wrap">
									<span className="input-ac">
										<span style={{color: '#999'}}>
											科目选择
										</span>
									</span>
									<Icon type='triangle' className="assets-item-triangle"/>
								</span> :
								<span className="input-ac-wrap">
									<span className="input-ac">
										<span>
											{debitId ? debitId + '_' + assetsCard.get('debitName') : '选择'}
										</span>
									</span>
									<Icon type='triangle' className="assets-item-triangle"/>
								</span>
							}
                        </Item>
						{
							debitAssList.size ?
							debitAssList.map((v, i) =>{
							const sourceList = getSourceList(v.get('assCategory'))
							const assCategory = v.get('assCategory')
							return <Item
								label={`辅助核算(${v.get('assCategory')}):`}
								key={i}
								onClick={() => {
									if (!sourceList.size) {
										thirdParty.Alert(`${assCategory}中所有的核算项目为禁用状态，您可以：1、账套管理员在“辅助核算设置”页面中，启用已有的核算项目；2、在当前页面，“新增”新的核算项目`)
										return
									}
								}}>
								{sourceList.size ?
									<SinglePicker
										className="info-select"
										district={getSourceList(v.get('assCategory'))}
										onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'card', 'debitAssList', i))}
									>
										<span className="css-triangle-color">
											<span>{v.get('assId') ? v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName') : ''}</span>
										</span>
									</SinglePicker> :
									(<span className="css-triangle-color"></span>)
									// <Select
									// 	className="info-select"
									// 	source={getSourceList(v.get('assCategory'))}
										// text={v.get('assId') ?
										// v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName')
										// : ''}
									// 	onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'card', 'debitAssList', i))}
									// /> : (<span className="css-triangle-color"></span>)
								}
							</Item>
						}) : ''
						}
                        <Item
							label="账务处理贷方科目"
							showAsterisk={true}
							className="form-offset-border input-ac-sign-box"
							onClick={() => {
								dispatch(assetsActions.assetsToAc('credit', 'card'))
								selectAc(cascadeDataAclist, aclist, (...value) => dispatch(assetsActions.assetsSelectAc(...value)))
								// history.push('/config/acassets/ac')
								// dispatch(acconfigActions.assetsToAc('credit', 'card'))
							}}>
							{
								creditId === '' ?
								// <span style={{color: '#999'}}>科目选择&nbsp;<Icon type='triangle'  className="assets-item-color"/></span
								<span className="input-ac-wrap">
									<span className="input-ac">
										<span style={{color: '#999'}}>
											科目选择
										</span>
									</span>
									<Icon type='triangle' className="assets-item-triangle"/>
								</span> :
								<span className="input-ac-wrap">
									<span className="input-ac">
										<span>
											{creditId ? creditId + '_' + assetsCard.get('creditName') : '选择'}
										</span>
									</span>
									<Icon type='triangle' className="assets-item-triangle"/>
								</span>
							}
                        </Item>
						{
							creditAssList.size ?
							creditAssList.map((v, i) =>{
								const sourceList = getSourceList(v.get('assCategory'))
								const assCategory = v.get('assCategory')
								return <Item
									key={i}
									label={`辅助核算(${v.get('assCategory')}):`}
									style={{display: creditAssList.size === 0 ? 'none' : ''}}
									onClick={() => {
										if (!sourceList.size) {
											thirdParty.Alert(`${assCategory}中所有的核算项目为禁用状态，您可以：1、账套管理员在“辅助核算设置”页面中，启用已有的核算项目；2、在当前页面，“新增”新的核算项目`)
											return
										}
									}}
									>
									{sourceList.size ?
										<SinglePicker
											className="info-select"
											district={getSourceList(v.get('assCategory'))}
											onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'card', 'creditAssList', i))}
										>
											<span className="css-triangle-color">
												<span>{v.get('assId') ? v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName') : ''}</span>
											</span>
										</SinglePicker> :
										(<span className="css-triangle-color"></span>)
										// <Select
										// 	className="info-select"
										// 	source={getSourceList(v.get('assCategory'))}
										// 	text={v.get('assId') ?
										// 	v.get('assCategory') + '_' + v.get('assId') + '_' + v.get('assName')
										// 	: ''}
										// 	onOk={(result) => dispatch(assetsActions.enterClassificationOrCardAsslist(result.value, 'card', 'creditAssList', i))}
										// /> : (<span className="css-triangle-color"></span>)
									}
								</Item>
							}) : ''
						}
                        <div className="form-classify-head">原值、净值、累计折旧</div>
                        <Item label="原值" showAsterisk={true}>
							{ closeStatus ? <span disabled>{assetsCard.get('cardValue')}</span>
								:
								<TextInput
	                                type="text"
									textAlign='right'
	                                className="number-input-assets form-input"
									value={assetsCard.get('cardValue')}
									onChange={value => dispatch(assetsActions.changeCardOriginalValue(value))}
	                            />
							}
                        </Item>
                        <Item label="残值率(%)" className="input-percent-sign-box" showAsterisk={true}>
							{ closeStatus ? <span disabled style={{marginRight: '.2rem'}}>{assetsCard.get('salvage')}</span>
								:
								<TextInput
	                                type="number"
									textAlign='right'
	                                className="number-input-assets form-input input-percent-sign"
									value={assetsCard.get('salvage')}
									onChange={value => dispatch(assetsActions.changeCardSalvage(value))}
	                            />
							}
                        </Item>
						<Item label="预计残值">
                            <span className="change-color">{residualValue}</span>
                        </Item>
                        <Item label="已折旧/分摊期间">
                            <span className="change-color">{alreadyDepreciationTime < 0 ? '' : alreadyDepreciationTime}</span>
                        </Item>
                        <Item label="期初累计折旧／分摊">
                            <span className="change-color">{sumDepreciation}</span>
                        </Item>
                        <Item label="期初净值">
                            <span className="change-color">{earlyNetWorth}</span>
                        </Item>
						<Item label="月折旧/分摊">
                            <span className="change-color">{monthlyDepreciation}</span>
                        </Item>
                    </Form>
					{
						assetsCardMode === 'insert' ? '' :
						<div>
							<Button
								className="deletecard"
								onClick={() => {
									if (editPermission) {
										assetsActions.deleteSingleCard(assetsCard.get('cardNumber'), history)
									} else {
										thirdParty.toast.info(`您没有此项操作权限`)
									}
								}}
							><span>删除卡片</span></Button>
							<span className="assets-stamp">{statusText}</span>
						</div>
					}
                </ScrollView>
				{/* 卡片详情布局 */}
				<CardSelecter
					style={{display: assetsCardMode === 'detail' ? '' : 'none'}}
					dispatch={dispatch}
					cardDetailList={cardDetailList}
					cardNumber={cardNumber}
					serialNumber={serialNumber}
				/>
				<ScrollView flex="1" className="carddetail-body" style={{position: 'relative', display: assetsCardMode === 'detail' ? '' : 'none'}}>
					<div className="carddetail-body-main">
						<div className="carddetail-item">
						<div className="carddetail-item-head">名称</div>
						<div className="carddetail-item-content">{assetsCard.get('cardName')}</div>
					</div>
					<div className="carddetail-item">
						<div className="carddetail-item-head">标签</div>
						<div className="carddetail-item-content">{assetsCard.get('label').join('；')}</div>
					</div>
					<div className="carddetail-item">
						<div className="carddetail-item-head">借方科目</div>
						<div className="carddetail-item-content">{`${assetsCard.get('debitId')}_${assetsCard.get('debitName')}`}</div>
					</div>
					{
						assetsCard.get('debitAssList').size ?
							assetsCard.get('debitAssList').map((v, i) =>
								<div className="carddetail-item" key={i}>
									<div className="carddetail-item-head">{i === 0 ? '辅助核算' : ''}</div>
									<div className="carddetail-item-content">{`${v.get('assCategory')}_${v.get('assId')}_${v.get('assName')}`}</div>
								</div>
							)
						: ''
					}
					<div className="carddetail-item">
						<div className="carddetail-item-head">贷方科目</div>
						<div className="carddetail-item-content">{`${assetsCard.get('creditId')}_${assetsCard.get('creditName')}`}</div>
					</div>
					{
						assetsCard.get('creditAssList').size ?
							assetsCard.get('creditAssList').map((v, i) =>
							<div className="carddetail-item" key={i}>
								<div className="carddetail-item-head">{i === 0 ? '辅助核算' : ''}</div>
								<div className="carddetail-item-content">{`${v.get('assCategory')}_${v.get('assId')}_${v.get('assName')}`}</div>
							</div>
						)
						: ''
					}
					</div>
					<p className="detail-divide-line">其他详情</p>
					<div className="carddetail-body-other">
						<div className="carddetail-item">
							<div className="carddetail-item-head">原值</div>
							<div className="carddetail-item-content">{assetsCard.get('cardValue')}</div>
						</div>
						<div className="carddetail-item">
							<div className="carddetail-item-head">残值率</div>
							<div className="carddetail-item-content">{`${assetsCard.get('salvage')} %`}</div>
						</div>
						<div className="carddetail-item">
							<div className="carddetail-item-head">预计残值</div>
							<div className="carddetail-item-content">{residualValue}</div>
						</div>
						<div className="carddetail-item">
							<div className="carddetail-item-head">使用总期限</div>
							<div className="carddetail-item-content">{`${assetsCard.get('totalMonth')}月 (${assetsCard.get('depreciationMethod')})`}</div>
						</div>
						<div className="carddetail-item">
							<div className="carddetail-item-head">开始使用期间</div>
							<div className="carddetail-item-content">{assetsCard.get('startTime')}</div>
						</div>
						<div className="carddetail-item">
							{/* <div className="carddetail-item-head">本期期间</div>
							<div className="carddetail-item-content">{assetsCard.get('currentCardTime')}</div> */}
							<div className="carddetail-item-head">录入期间</div>
							<div className="carddetail-item-content">{assetsCard.get('inputPeriod')}</div>
						</div>
						<div className="carddetail-item">
							<div className="carddetail-item-head">已折旧/分摊期间</div>
							<div className="carddetail-item-content">{alreadyDepreciationTime}</div>
						</div>
						<div className="carddetail-item">
							<div className="carddetail-item-head">期初累计折旧/分摊</div>
							<div className="carddetail-item-content">{sumDepreciation}</div>
						</div>
						<div className="carddetail-item">
							<div className="carddetail-item-head">期初净值</div>
							<div className="carddetail-item-content">{earlyNetWorth}</div>
						</div>
						<div className="carddetail-item">
							<div className="carddetail-item-head">月折旧/分摊</div>
							<div className="carddetail-item-content">{monthlyDepreciation}</div>
						</div>
						<div className="carddetail-item">
							<div className="carddetail-item-head">备注</div>
							<div className="carddetail-item-content">{remark}</div>
						</div>
					</div>
					<span className="assets-stamp" style={{top: '0.11rem'}}>{statusText}</span>
				</ScrollView>
                <Row>
					<ButtonGroup height={50} style={{display: assetsCardMode === 'detail' ? '' : 'none'}}>
						<Button
							disabled={(assetsCard.get('status') === '0' ? false : true) || !editPermission}
							onClick={() => {
								thirdParty.Prompt({
									message: '复制卡片的数量:',
									title: '复制并新增卡片',
									buttonLabels: ['取消', '确认'],
									onSuccess: (result) => {
										if (result.buttonIndex === 1) {
											dispatch(assetsActions.copyCardFetch(result.value, history))
										}
									}
							})}}>
							<Icon type='copy'/><span>复制</span>
						</Button>
						<Button onClick={() => history.goBack()}><Icon type='cancel'/><span>取消</span></Button>
						<Button
							disabled={(['0', '1', '3'].indexOf(status) === -1) || !editPermission}
							onClick={() => {
								if (status === '0') {
									dispatch(assetsActions.clearCardFetch('1', cardNumber, period.get('openedyear'), period.get('openedmonth')))
								} else if(assetsCard.get('status') === '1') {
									dispatch(assetsActions.cancelClearCard('0', cardNumber))
								} else if(assetsCard.get('status') === '3') {
									dispatch(assetsActions.clearCardFetch('1', cardNumber, period.get('openedyear'), period.get('openedmonth')))
								}
							}}
							>
							<Icon type='clean'/><span>{assetsCard.get('status') === '1' ? '取消清理' : '清理'}</span>
						</Button>
						<Button
							// disabled={!abledClick}
							disabled={!editPermission}
							onClick={() => {
							dispatch(assetsActions.beforeMofifyCard())
							}}><Icon type='edit'/><span>修改</span>
						</Button>
					</ButtonGroup>
                    <ButtonGroup height={50} style={{display: assetsCardMode === 'insert' ? '' : 'none'}}>
                        <Button
							disabled={!editPermission}
							onClick={() => {
								dispatch(assetsActions.enterCard(residualValue, monthlyDepreciation, alreadyDepreciationTime, sumDepreciation, earlyNetWorth, '', history))
							}}>
							<Icon type='save'/><span>保存</span></Button>
                        <Button
							disabled={!editPermission}
							onClick={() => {
								dispatch(assetsActions.enterCard(residualValue, monthlyDepreciation, alreadyDepreciationTime, sumDepreciation, earlyNetWorth, 'save', history))
							}}>
							<Icon type='new'/><span>保存并新增</span>
						</Button>
                    </ButtonGroup>
                    <ButtonGroup height={50} style={{display: assetsCardMode === 'modify' ? '' : 'none'}}>
						<Button onClick={() => {
							dispatch(assetsActions.changeDetailCard())
							dispatch(assetsActions.getAssetsCardFetch(cardNumber, assetsCard.get('serialNumber'), history))
						}}><Icon type='cancel'/><span>取消</span></Button>
						<Button
							disabled={!editPermission}
							onClick={() => {
								dispatch(assetsActions.enterCard(residualValue, monthlyDepreciation, alreadyDepreciationTime, sumDepreciation, earlyNetWorth, '', history))
							}}
							><Icon type='save'/><span>保存</span>
						</Button>
                    </ButtonGroup>
                </Row>
            </Container>
        )
    }
}
