import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { fromJS, toJS } from 'immutable'
import { message } from 'antd'
import { Icon } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'
import CombAbsInput from './CombAbsInput.jsx'
import CombInput from './CombInput.jsx'
import CombSelect from './CombSelect.jsx'
import CombNumber from './CombNumber.jsx'
import CombCurrency from './CombCurrency.jsx'

import * as lrpzActions_init from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as allActions from 'app/redux/Home/All/all.action'

@immutableRenderDecorator
export default
class JvItem extends React.Component {

	constructor() {
		super()
		this.state = {
			countBlur: false,
			priceBlur: false,
			standardAmountBlur: false,
			exchangeBlur: false,
			acunitOpen: '0'
		}
	}

	render() {
		const {
			idx,
			jvItem,
			vcDate,
			dispatch,
			jvListLength,
			selectAcList,
			creditAmount,
			debitAmount,
			focusRef,
			allAssList,
			closedBy,
			reviewedBy,
			assDropListFull,
			amountDisplay,
			currencyList,
			currencyDisplay,
			showAssDisableInfo,
			unitDecimalCount
		 } = this.props
		 const { countBlur, priceBlur, standardAmountBlur, exchangeBlur, acunitOpen } = this.state

		const acId = jvItem.get('acid')
		const acFullName = jvItem.get('acfullname')
		const assCategoryList =  selectAcList.find(v => v.get('acid') == acId && v.get('acfullname') == acFullName)
		const finnalAssList =  allAssList.filter(v => (assCategoryList ? assCategoryList.get('asscategorylist') : []).includes(v.get('asscategory')))

		const lrpzActions = (!!closedBy || !!reviewedBy) ? new Proxy({}, {get: () => () => ({type: 'NO_CHANGE'})}) : lrpzActions_init
		const focusClick = (id) => dispatch(lrpzActions.changeFocusInput(id))

		let allAssValue = ''   //拼接所选的所有辅助核算
		let allAssValueOne = ''   //拼接所选的辅助核算
		let allAssValueTwo = ''   //拼接所选的辅助核算
		jvItem.get('asslist').map((v, i) => {
			allAssValue = allAssValue ? allAssValue + '_' + v.get('asscategory') + '_' + v.get('assid') + '_' + v.get('assname') : v.get('asscategory') + '_' + v.get('assid') + '_' + v.get('assname')
			if(i==0){
				allAssValueOne = v.get('asscategory') + '_' + v.get('assid') + '_' + v.get('assname')
			}else if(i==1){
				allAssValueTwo = v.get('asscategory') + '_' + v.get('assid') + '_' + v.get('assname')
			}
		})

		let jvCount = jvItem.get('jvcount')
		if (jvCount == 0) {
			if (!countBlur) {	//失去焦点不显示0
				jvCount = ''
			}
		}
		let price = jvItem.get('price')
		if (price == 0) {
			if (!priceBlur) {	//失去焦点
				price = ''
			}
		}

		let standardAmount = jvItem.get('standardAmount')
		if (standardAmount == 0) {
			if (!standardAmountBlur) {	//失去焦点
				standardAmount = ''
			}
		}
		let exchange = jvItem.get('exchange')
		if (exchange == 0) {
			if (!exchangeBlur) {	//失去焦点
				exchange = ''
			}
		}

		return (
			<div className="voucher-jvwrap">
				<div className="jv-mask">
					<span>
						<Icon
							type="plus-circle"
							onClick={() => {

								if (jvListLength === 30) {
									thirdParty.Alert('建议分录不要超过30条')
								}

								if (jvListLength === 60) {
									thirdParty.Alert('强烈建议分录不要超过60条')
								}

								if (jvListLength < 90) {
									dispatch(lrpzActions.insertJvItem(idx))
								} else {
									thirdParty.Alert('禁止分录超过90条')
								}
							}}
						/>
						<Icon onClick={() => dispatch(lrpzActions.deleteJvItem(idx))} type="close-circle"/>
					</span>
					<span>必填</span>
					<span style={{pointerEvents: 'none'}}>
						<span style={{pointerEvents: 'auto'}} onClick={() => {
							// dispatch(allActions.usersUseLog('lrpz_selectAc'))
							dispatch(lrpzActions.changeAcModalDisplay(idx))
						}}>选择科目</span>
						<span style={{pointerEvents: 'auto'}} onClick={() => {
							sessionStorage.setItem('enterLrModal', 'lrpz')
							// dispatch(allActions.usersUseLog('lrpz_newAc'))
							dispatch(lrpzActions.changelrAcModalDisplay())
						}}>新增科目</span>
						<span style={{'display': jvItem.get('closingbalance') === undefined ? 'none' : ''}}>
							余额: {jvItem.get('closingbalance')}
						</span>
					</span>
				</div>
				<div className="voucher-jv">
					<CombAbsInput
						copy={jvItem.get('copy')}
						className="voucher-abstract"
						id={"abstract-" + idx}
						value={jvItem.get('jvabstract')}
						assDropListFull={assDropListFull}
						onChange={e => dispatch(lrpzActions.changeJvAbstract(e.target.value, idx, false))}
						onBlur={e => dispatch(lrpzActions.changeJvAbstract(e.target.value, idx, true))}
						onClick={() => idx && sessionStorage.getItem('lrpzHandleMode') == 'insert' ? dispatch(lrpzActions.copyJvAbstract(idx)) : null}
						focus={"abstract-" + idx == focusRef}
						focusClick={focusClick}
						isInsert={jvItem.get('isInsert')}
					/>
					<CombSelect
						className="voucher-acount"
						id={"select-" + idx}
						focus={"select-" + idx == focusRef}
						selectAcList={selectAcList}
						dispatch={dispatch}
						finnalAssList={finnalAssList}
						allAssValue={allAssValue}
						allAssValueOne={allAssValueOne}
						allAssValueTwo={allAssValueTwo}
						acValue={acId ? `${acId} ${acFullName}` : ''}
						jvAssList={jvItem.get('asslist')}
						acunitOpen={acunitOpen}
						assDropListFull={jvItem.get('asslist').some(v => !v.get('assid'))}
						showAssDisableInfo={showAssDisableInfo}
						onChange={(value) => {
							const acIndex = value.split(' ')[0]
							const acItem = selectAcList.find(v => v.get('acid') == acIndex)

							if (acItem === undefined) {
								return message.info('科目异常，请刷新')
							}

							dispatch(lrpzActions.changeJvAc(idx, acIndex, acItem && acItem.get('acname'), acItem && acItem.get('acfullname'), acItem && acItem.get('asscategorylist'), acItem && acItem.get('acunitOpen')))

							// this.setState({acunitOpen: acItem.get('acunitOpen')})
							if (acItem) {
								this.setState({acunitOpen: acItem.get('acunitOpen')})
							}

							if(acIndex){
								if (!acItem.get('asscategorylist').size) {
									if (acItem.get('acunitOpen') == '1') {
										dispatch(lrpzActions.getAmountDataFetch(acIndex, vcDate, idx)) //获取数量
									}
									dispatch(lrpzActions.getAcCloseBalance(acIndex, vcDate, idx)) //获取余额
								}
								if(acItem.get('fcStatus') == '1'){
									dispatch(lrpzActions.getFCListDataFetch(idx)) //获取外币
								}
							}
						}}
						cancleAssInput={value => {
							console.log('cancleAssInput', value);
							dispatch(lrpzActions.cancleAssInput(idx, value))
						}}
						onAssChange={(assCategory, value, i) => {
							// if (acunitOpen == '1' && i === 0 && value !== '') {
							if (jvItem.get('asslist').size === 1) {
								// 单辅助
								if (jvItem.get('acunitOpen') == '1') {
									dispatch(lrpzActions.getAmountDataFetch(acId, vcDate, idx, assCategory, value.split(Limit.ASS_ID_AND_NAME_CONNECT)[0]))  // 获取单辅助核算的数量
								}
								dispatch(lrpzActions.getAcCloseBalance(acId, vcDate, idx, assCategory, value.split(Limit.ASS_ID_AND_NAME_CONNECT)[0])) // 获取单辅助核算的余额
							} else if (jvItem.get('asslist').size === 2) {
								// 双辅助
								// 取当前录入的另一个辅助核算的 assid ，判断另一个辅助核算是否填写， 只有两个都填了 才发送获取数量单价和余额
								const otherAsslist = jvItem.get('asslist').find(v => v.get('asscategory') !== assCategory)
								const otherAssCategory = otherAsslist.get('asscategory')
								const otherAssId = otherAsslist.get('assid')

								if (otherAssId) {
									if (jvItem.get('acunitOpen') == '1') {
										dispatch(lrpzActions.getAmountDataFetch(acId, vcDate, idx, assCategory, value.split(Limit.ASS_ID_AND_NAME_CONNECT)[0], otherAssCategory, otherAssId))
									}
									dispatch(lrpzActions.getAcCloseBalance(acId, vcDate, idx, assCategory, value.split(Limit.ASS_ID_AND_NAME_CONNECT)[0], otherAssCategory, otherAssId))
								}
							}

							// if (jvItem.get('acunitOpen') == '1' && i === 0 && value !== '') {
							// 	dispatch(lrpzActions.getAmountDataFetch(acId, vcDate, idx, assCategory, value.split(Limit.ASS_ID_AND_NAME_CONNECT)[0]))
							// }
							dispatch(lrpzActions.changeJvAss(idx, assCategory, value))
						}}
						onClick={() => {
							if ("select-" + idx != focusRef)
								dispatch(lrpzActions.changeFocusInput("select-" + idx))
						}}
					/>
					<CombNumber
						amountDisplay={amountDisplay}
						id={idx}
						jvItem={jvItem}
						dispatch={dispatch}
						jvCount={jvCount}
						price={price}
						idAmount={"amount-" + idx}
						idPrice={"price-" + idx}
						focusAmount={"amount-" + idx == focusRef}
						focusPrice={"price-" + idx == focusRef}
						focusClickAmount={focusClick}
						focusClickPrice={focusClick}
						onChangeAmount={(e) => {

							let value = e.target.value
							if (value == '.') {
								value = '0.'
							} else if (value == '-.') {
								value = '-0.'
							}

							if(value > 1000000 || value < -1000000){
								return message.warn(`数量不能超过${Limit.LRPZ_COUNT_LENGTH}位`);
							}
							dispatch(lrpzActions.changeJvCount(value, idx, unitDecimalCount))
						}}
						onFocusAmount={e => {
							this.setState({countBlur: true})
							e.target.value = jvCount ? jvCount : ''
						}}
						onBlurAmount={()=>{
							this.setState({countBlur: false})
							// dispatch(lrpzActions.autoCalculate(idx, "count"))
							if (jvItem.get('fcStatus') == '1' || jvItem.get('fcNumber')) {
								dispatch(lrpzActions.autoCalculateAll(idx, "count", unitDecimalCount))
							} else {
								dispatch(lrpzActions.autoCalculate(idx, "count", unitDecimalCount))
							}
						}}
						onChangePrice={e => {
							let value = e.target.value;
							if(e.target.value<0){
								message.warn('单价不允许为负数');
								value = -value;
							}

							if (value == '.') {
								value = '0.'
							}

							if( value > 1000000000 || value < -1000000000){
								return message.warn(`单价不能超过${Limit.LRPZ_PRICE_LENGTH}位`);
							}
							dispatch(lrpzActions.changeJvPrice(value, idx))}
						}
						onFocusPrice={e => {
							this.setState({priceBlur: true})
							e.target.value = price ? price : ''
						}}
						onBlurPrice={()=>{
							this.setState({priceBlur: false})
							// dispatch(lrpzActions.autoCalculate(idx, "price"))
							if (jvItem.get('fcStatus') == '1' || jvItem.get('fcNumber')) {
								dispatch(lrpzActions.autoCalculateAll(idx, "price", unitDecimalCount))
							} else {
								dispatch(lrpzActions.autoCalculate(idx, "price", unitDecimalCount))
							}
						}}
					/>
					<CombCurrency
						id={idx}
						jvItem={jvItem}
						dispatch={dispatch}
						exchange={exchange}
						standardAmount={standardAmount}
						currencyList={currencyList}
						currencyDisplay={currencyDisplay}
						idStandardAmount={"standardAmount-" + idx}
						idExchange={"exchange-" + idx}
						focusStandardAmount={"standardAmount-" + idx == focusRef}
						focusExchange={"exchange-" + idx == focusRef}
						focusClickStandardAmount={focusClick}
						focusClickExchange={focusClick}
						onSelect={value => {
							dispatch(lrpzActions.changeJvItemNumber(idx, value))

						}}
						changeStandardAmount={e =>  dispatch(lrpzActions.changeJvStandardAmount(idx, e.target.value))}
						changeExchange={e => {
							let value = e.target.value
							if (value == '.') {
								value = '0.'
							} else if (value == '-.') {
								value = '-0.'
							}
							dispatch(lrpzActions.changeJvExchange(idx, value))
						}}
						onFocusStandardAmount={e => {
							this.setState({standardAmountBlur: true})
							e.target.value = standardAmount ? standardAmount : ''
						}}
						onBlurStandardAmount={()=>{
							this.setState({standardAmountBlur: false})
							dispatch(lrpzActions.autoCalculateAll(idx, "standardAmount", unitDecimalCount))
						}}
						onFocusExchange={e => {
							this.setState({exchangeBlur: true})
							e.target.value = standardAmount ? standardAmount : ''
						}}
						onBlurExchange={()=>{
							this.setState({exchangeBlur: false})
							dispatch(lrpzActions.autoCalculateAll(idx, "exchange", unitDecimalCount))
						}}
					/>
					<CombInput
						style={{fontSize: 20, textAlign: 'right'}}
						className="voucher-de"
						value={jvItem.get('jvdirection') === 'credit' ? '' : jvItem.get('jvamount')}
						showAmount
						id={"de-" + idx}
						focus={"de-" + idx == focusRef}
						focusClick={focusClick}
						amountValue={debitAmount}
						assDropListFull={assDropListFull}
						onChange={e => {

							let value = e.target.value
							if (value == '.') {
								value = '0.'
							} else if (value == '-.') {
								value = '-0.'
							}

							dispatch(lrpzActions.changeJvDirection(idx, 'debit'))
							dispatch(lrpzActions.changeJvAmount(value, idx, 'debit'))
						}}
						onBlur={()=> {
							// dispatch(lrpzActions.autoCalculate(idx,"amount"))
							if (jvItem.get('fcStatus') == '1' || jvItem.get('fcNumber')) {
								dispatch(lrpzActions.autoCalculateAll(idx, "amount", unitDecimalCount))
							} else {
								dispatch(lrpzActions.autoCalculate(idx, "amount", unitDecimalCount))
							}

						}}
						onKeyDown={() => {
							var oEvent = window.event;
							if (oEvent.keyCode == 32){	//切换贷借方金额
								dispatch(lrpzActions.changeJvDirectionByKey(idx, 'debit'))
							}
						}}

					/>
					<CombInput
						style={{fontSize: 20, textAlign: 'right'}}
						className="voucher-cr"
						value={jvItem.get('jvdirection') === 'credit' ? jvItem.get('jvamount') : ''}
						showAmount
						id={"cr-" + idx}
						focus={"cr-" + idx == focusRef}
						focusClick={focusClick}
						amountValue={creditAmount}
						assDropListFull={assDropListFull}
						onChange={e => {

							let value = e.target.value
							if (value == '.') {
								value = '0.'
							} else if (value == '-.') {
								value = '-0.'
							}

							dispatch(lrpzActions.changeJvDirection(idx, 'credit'))
							dispatch(lrpzActions.changeJvAmount(value, idx, 'credit'))
						}}
						onBlur={()=> {
							// dispatch(lrpzActions.autoCalculate(idx,"amount"))
							if (jvItem.get('fcStatus') == '1' || jvItem.get('fcNumber')) {
								dispatch(lrpzActions.autoCalculateAll(idx, "amount", unitDecimalCount))
							} else {
								dispatch(lrpzActions.autoCalculate(idx, "amount", unitDecimalCount))
							}
						}}
						onKeyDown={() => {
							var oEvent = window.event;
							if (oEvent.keyCode == 32){	//切换贷借方金额
								dispatch(lrpzActions.changeJvDirectionByKey(idx, 'credit'))
							}
						}}
					/>
				</div>
			</div>
		)
	}
}
