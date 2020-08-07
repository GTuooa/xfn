import React, { PropTypes } from 'react'
import { Map, List, fromJS, toJS } from 'immutable'

import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
//
import * as thirdParty from 'app/thirdParty'
import { SwitchText, Icon, TextInput, AmountInput, Row, SinglePicker }	from 'app/components'
import * as Limit from 'app/constants/Limit.js'

function valueToIdAndName(value) {
	let id = value.match(/^[A-Za-z0-9]*/)
	let name = value.match(/_.*$/)
	return {
		name: name.toString().replace('_', ''),
		id: id.toString()
	}
}

// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

// @immutableRenderDecorator
export default
class Jv extends React.Component {

	constructor() {
		super()
		this.state = {
			countBlur: false,
			priceBlur: false,
			acunitOpen: '0',
			standardAmountBlur: false,
			exchangeBlur: false
		}
	}

	render() {
		const {
			idx,
			jv,
			// aclist,
			vcdate,
			acasslist,
			deletable,
			dispatch,
			jvListLength,
			// cascadeDataAclist,
			selectComponentDisplay,
			currencyList,
			unitDecimalCount,
			onAcSelectClick
		} = this.props
		const { countBlur, priceBlur, acunitOpen, standardAmountBlur, exchangeBlur } = this.state

		const asslist = jv.get('asslist')
		//将分录辅助核算列表转换为辅助核算类别列表
		const asscategorylist = asslist.map(v => v.get('asscategory'))
		//是否存在辅助核算
		const hasAss = !!asscategorylist.size
		//将该分录的辅助核算类别与acasslist交叉比对，选出交集
		// const handleAcAssList = acasslist.filter(v => asscategorylist.indexOf(v.get('asscategory')) > -1)

		let jvCount = jv.get('jvcount')
		if (jvCount == 0) {
			if (!countBlur) {	//失去焦点不显示0
				jvCount = ''
			}
		}
		let price = jv.get('price')
		if (price == 0) {
			if (!priceBlur) {	//失去焦点
				price = ''
			}
		}

		let standardAmount = jv.get('standardAmount')
		if (standardAmount == 0) {
			if (!standardAmountBlur) {	//失去焦点
				standardAmount = ''
			}
		}

		let exchange = jv.get('exchange')
		if (exchange == 0) {
			if (!exchangeBlur) {	//失去焦点
				exchange = ''
			}
		}

		// const searchNumberFetch = (acid) => dispatch(lrpzActions.getAmountDataFetch(acid, vcdate, idx)) //获取数量一栏的数据
		// const clearAcUnitOpen = () => dispatch(lrpzActions.clearAcUnitOpen(idx))
		// const searchCurrencyFetch = () => dispatch(lrpzActions.getFCListDataFetch(idx))	//获取外币数据
		// const clearAcCurrency = () => dispatch(lrpzActions.clearFCListData(idx))

		const selectFCList = currencyList.map((u, j) => (
			{
				key: `${u.get('fcNumber')}${Limit.EMPTY_CONNECT}${u.get('name')}`,
				value: `${u.get('fcNumber')}${Limit.EMPTY_CONNECT}${u.get('name')}${Limit.EMPTY_CONNECT}${u.get('exchange')}`
			}))

		return (
            <div className="jv-item">
                <div className="jv-abstract">
                    <TextInput
						className="jv-abstract-content"
						moneyKeyboardAlign={'right'}
						type="text"
						placeholder="摘要填写"
						value={jv.get('jvabstract')}
						onChange={e => dispatch(lrpzActions.changeJvAbstract(e, idx))}
					/>
					<Icon
                        style={deletable ? undefined : {color: "#ccc"}}
                        type="close-item"
                        className="btn-close"
                        onClick={() => {dispatch(lrpzActions.deleteJv(idx))}}
                    />
                </div>
				<div className="jv-ac">
					<div
						className={`jv-ac-select${jv.get('acid') ? '' : '-placeholder'}`}
						onClick={() => {
							onAcSelectClick(idx, jv.get('acid'), (value) => this.setState({acunitOpen: value}))
							// selectAc(cascadeDataAclist, aclist, (...value) => dispatch(lrpzActions.changeJvAcIdAndAcNameAndAssCategoryList(idx, ...value)), 'lrpz', searchNumberFetch, clearAcUnitOpen, (value) => this.setState({acunitOpen: value}), searchCurrencyFetch, clearAcCurrency)
						}}>{jv.get('acid') ? (jv.get('acfullname') ? `${jv.get('acid')}_${jv.get('acfullname')}` : jv.get('acid')) : '请点击选择科目'}
					</div>
				</div>
				{/* {
					browserNavigator.versions.DingTalk && !global.isplayground ?
					<div className="jv-ac">
						<div
							className={`jv-ac-select${jv.get('acid') ? '' : '-placeholder'}`}
							onClick={() => {
								selectAc(cascadeDataAclist, aclist, (...value) => dispatch(lrpzActions.changeJvAcIdAndAcNameAndAssCategoryList(idx, ...value)), 'lrpz', searchNumberFetch, clearAcUnitOpen, (value) => this.setState({acunitOpen: value}), searchCurrencyFetch, clearAcCurrency)
							}}>{jv.get('acid') ? (jv.get('acfullname') ? `${jv.get('acid')}_${jv.get('acfullname')}` : jv.get('acid')) : '请点击选择科目'}
						</div>
					</div> :
					<SinglePicker
						className="jv-ac"
						district={aclist
								.filter(w => w.get('acid').match(jv.get('acid')))
								.map((u, j) => {return {
									key: [u.get('acid'), '_', u.get('acfullname')].join(''),
									value: [u.get('acid'), '_', u.get('acfullname')].join('')
								}}).toJS()}
						value={jv.get('acid') ? (jv.get('acfullname') ? `${jv.get('acid')}_${jv.get('acfullname')}` : jv.get('acid')) : ''}
						onOk={value => {
							if (!value.value) {
								dispatch(lrpzActions.changeJvAcIdAndAcNameAndAssCategoryList(idx, '', '', '', asscategorylist.clear()))
							} else {
								const acid = value.value.split('_')[0]
								const acitem = aclist.find(v => v.get('acid') == acid)
								const asscategorylist = acitem ? acitem.get('asscategorylist') : fromJS({})
								dispatch(lrpzActions.changeJvAcIdAndAcNameAndAssCategoryList(idx, acid, acitem ? acitem.get('acfullname') : '', acitem ? acitem.get('acname') : '', asscategorylist))

								if(acid && acitem.get('acunitOpen') == '1' && !acitem.get('asscategorylist').size){
									dispatch(lrpzActions.getAmountDataFetch(acid, vcdate, idx))	//获取数量一栏的数据
								} else {
									dispatch(lrpzActions.clearAcUnitOpen(idx)) //将 acunitOpen 设置为‘0’
								}
								if(acid && acitem.get('fcStatus') == '1'){
									dispatch(lrpzActions.getFCListDataFetch(idx))	//获取外币
								} else {
									dispatch(lrpzActions.clearFCListData(idx))	//清除数据
								}
							}
						}}
					>
						<div>
							<div
								className={`jv-ac-select${jv.get('acid') ? '' : '-placeholder'}`}
							>
								{jv.get('acid') ? (jv.get('acfullname') ? `${jv.get('acid')}_${jv.get('acfullname')}` : jv.get('acid')) : '请点击选择科目'}
							</div>
						</div>
					</SinglePicker>
				} */}
				{
					asslist.map((v, i) => {
						const acass = acasslist.find(w => w && w.get('asscategory') === v.get('asscategory'))

						const selectasslist = acass && acass.get('asslist')
						.filter(w => w.get('assid') && !w.get('disableTime'))
						.map((u, j) => ({key: [u.get('assid'), '_', u.get('assname')].join(''), value: [u.get('assid'), '_', u.get('assname')].join('')}))
						//判断该辅助核算类别下的item是否都被禁用
						const assIdList = acass.get('asslist').filter(w => w.get('assid')).filter(v => !v.get('disableTime'))

						const value = v.get('assid') ? v.get('asscategory') + '_' + v.get('assid') + '_' + v.get('assname') : `请点击选择辅助核算（类别：${v.get('asscategory')}）`

						if (!assIdList.size) {
							return <div
								key={i}
								className="jv-ass"
								style={{display: hasAss ? '' : 'none'}}
								>
								<div
									className={`jv-ass-select${v.get('assid') ? '' : '-placeholder'}`}
									onClick={() => {
										const info = v.get('asscategory') + '中所有的核算项目为禁用状态，您可以：1、账套管理员在“辅助核算设置”页面中，启用已有的核算项目；2、在当前页面，“新增”新的核算项目'
										thirdParty.Alert(info, '确定')
									}}>
									{value}
								</div>
							</div>
						} else {
							return <SinglePicker
								className={'jv-ass-margin'}
								key={i}
								district={selectasslist}
								onOk={(result) => {
									const ass = valueToIdAndName(result.key)

									if (jv.get('asslist').size === 1) {
										// 单辅助
										if (acunitOpen === '1') {
											dispatch(lrpzActions.getAmountDataFetch(jv.get('acid'), vcdate, idx, ass.id, v.get('asscategory')))  // 获取单辅助核算的数量
										}
									} else if (jv.get('asslist').size === 2) {
										// 双辅助
										// 取当前录入的另一个辅助核算的 assid ，判断另一个辅助核算是否填写， 只有两个都填了 才发送获取数量单价和余额
										const otherAsslist = jv.get('asslist').find(w => w.get('asscategory') !== v.get('asscategory'))
										const otherAssCategory = otherAsslist.get('asscategory')
										const otherAssId = otherAsslist.get('assid')

										if (otherAssId) {
											if (acunitOpen === '1') {
												dispatch(lrpzActions.getAmountDataFetch(jv.get('acid'), vcdate, idx, ass.id, v.get('asscategory'), otherAssId, otherAssCategory))
											}
										}
									}
									dispatch(lrpzActions.changeJvAssIdAndAssName(idx, ass.id, ass.name, v.get('asscategory')))
								}}
							>
								<div
									key={i}
									className="jv-ass"
									style={{display: hasAss ? '' : 'none'}}
									>
									<div className={`jv-ass-select${v.get('assid') ? '' : '-placeholder'}`}>
										{value}
									</div>
								</div>
							</SinglePicker>
						}
					})
				}
				<div className="jv-number" style={{display: jv.get('acunitOpen') == '1' ? 'flex' : 'none' }}>
					<span className="jv-number-position jv-number-left jv-amount-content">
						<AmountInput
							type="text"
							placeholder="数量填写"
							value={jv.get('jvcount')}
							moneyKeyboardAlign={'left'}
							decimalPlaces={unitDecimalCount}
							onChange={value => dispatch(lrpzActions.changeJvCount(value, idx, unitDecimalCount))}
							onFocus={value => {
								this.setState({countBlur: true})
								value = jvCount ? jvCount : ''
							}}
							onBlur={()=>{
								this.setState({countBlur: false})
								// dispatch(lrpzActions.autoCalculate(idx, "count"))
								if (jv.get('fcStatus') == '1' || jv.get('fcNumber')) {
									dispatch(lrpzActions.autoCalculateAll(idx, "count", unitDecimalCount))
								} else {
									dispatch(lrpzActions.autoCalculate(idx, "count", unitDecimalCount))
								}
							}}
						/>
						<span className="jv-number-unit">{jv.get('jvunit')}</span>
					</span>
					<span className="jv-number-right jv-amount-content">
						<AmountInput
							type="text"
							placeholder="单价填写"
							moneyKeyboardAlign={'left'}
							value={jv.get('price')}
							onChange={value => {
								dispatch(lrpzActions.changeJvPrice(value, idx))
							}}
							onFocus={value => {
								this.setState({priceBlur: true})
								value = price ? price : ''
							}}
							onBlur={()=>{
								this.setState({priceBlur: false})
								// dispatch(lrpzActions.autoCalculate(idx, "price"))
								if (jv.get('fcStatus') == '1' || jv.get('fcNumber')) {
									dispatch(lrpzActions.autoCalculateAll(idx, "price", unitDecimalCount))
								} else {
									dispatch(lrpzActions.autoCalculate(idx, "price", unitDecimalCount))
								}
							}}
						/>
					</span>
				</div>
				<div className="jv-currency" style={{display: jv.get('fcStatus') == '1' || jv.get('fcNumber') ? 'flex' : 'none' }}>
					<span className="jv-currency-left jv-amount-content">
						<AmountInput
							type="text"
							placeholder="原币："
							moneyKeyboardAlign={'left'}
							value={jv.get('standardAmount')}
							onChange={value => dispatch(lrpzActions.changeJvStandardAmount(idx, value))}
							onFocus={value => {
								this.setState({standardAmountBlur: true})
								value = standardAmount ? standardAmount : ''
							}}
							onBlur={()=>{
								this.setState({standardAmountBlur: false})
								dispatch(lrpzActions.autoCalculateAll(idx, "standardAmount", unitDecimalCount))
							}}
						/>
					</span>
					<div className="jv-currency-right">
						<SinglePicker
							district={selectFCList}
							onOk={(result) => {
								const arr = result.value.split(Limit.EMPTY_CONNECT)
								const fcNumber = arr[0]
								const exchange = arr[2]
								dispatch(lrpzActions.changeJvNumber(idx ,fcNumber, exchange)) && dispatch(lrpzActions.autoCalculateAll(idx, "exchange", unitDecimalCount))
							}}
							>
							<span className="jv-currency-fcNumber">
								<span>{jv.get('fcNumber')}</span>
								<Icon type="triangle" size="11" style={{color: '#CCCCCC'}} />
							</span>
						</SinglePicker>
						<span className="jv-currency-right-input">
							<AmountInput
								className="jv-amount-content"
								type="text"
								placeholder=""
								moneyKeyboardAlign={'left'}
								value={jv.get('exchange')}
								onChange={value => {
									dispatch(lrpzActions.changeJvExchange(idx, value))
								}}
								onFocus={value => {
									this.setState({exchangeBlur: true})
									value = exchange ? exchange : ''
								}}
								onBlur={()=>{
									this.setState({exchangeBlur: false})
									dispatch(lrpzActions.autoCalculateAll(idx, "exchange", unitDecimalCount))
								}}
							/>
						</span>
					</div>
				</div>
				<div className="jv-amount">
					<span className="jv-amount-content">
						<AmountInput
							moneyKeyboardAlign={'left'}
							placeholder="金额填写"
							value={jv.get('jvamount')}
							onChange={value => dispatch(lrpzActions.changeJvAmount(value, idx))}
							// onBlur={()=> dispatch(lrpzActions.autoCalculate(idx, "amount"))}
							onBlur={() => {
								if (jv.get('fcStatus') == '1' || jv.get('fcNumber')) {
									dispatch(lrpzActions.autoCalculateAll(idx, "amount", unitDecimalCount))
								} else {
									dispatch(lrpzActions.autoCalculate(idx, "amount", unitDecimalCount))
								}
							}}
						/>
					</span>
					<SwitchText
						checked={jv.get('jvdirection') === 'credit'}
						checkedChildren="贷"
						unCheckedChildren="借"
						onChange={()=> dispatch(lrpzActions.changeJvDirection(idx))}
					/>
					<a
						className="jv-amount-btn jv-amount-primary"
						href='javascript:;'
						onClick={() => {
							if (jvListLength === 30) {
								thirdParty.Alert('建议分录不要超过30条')
							}

							if (jvListLength === 60) {
								thirdParty.Alert('强烈建议分录不要超过60条')
							}

							if (jvListLength < 90) {
								dispatch(lrpzActions.insertJv(idx))
							} else {
								thirdParty.Alert('禁止分录超过90条')
							}
						}}
						>
						<Icon type="add"/>
						<span>增加分录</span>
					</a>
				</div>
            </div>
        )
    }
}
