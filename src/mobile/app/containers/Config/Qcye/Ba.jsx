import React, { PropTypes } from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { fromJS, Map, List } from 'immutable'
import * as qcyeActions from 'app/redux/Config/Qcye/qcye.action'
import { TextInput, AmountInput, Icon } from 'app/components'
import * as thirdParty from 'app/thirdParty'
import { formatMoney } from 'app/utils'
import { Amount } from 'app/components'
import AssBa from './AssBa'

// function valueToIdAndName(value) {
// 	let id = value.match(/^\d*/) || ''
// 	let name = value.match(/_.*$/) || ''
// 	return {
// 		name: name.toString().replace('_', ''),
// 		id: id.toString()
// 	}
// }

function chosen(source) {
	return new Promise((resolve, reject) => {
	})
}

@immutableRenderDecorator
export default
class Balance extends React.Component {
	constructor() {
		super()
		this.state = {
			qcyeClickBool: false,
			showAsslist: false,
			qcyeCountClickBool: false
		}
	}

	render() {
		const {
			ac,
			idx,
			style,
			aclist,
			hasSub,
			dispatch,
			acbalist,
			acasslist,
			itemstyle,
			isExpanded,
			unitDecimalCount,
		} = this.props
		const { qcyeClickBool, showAsslist, qcyeCountClickBool } = this.state

		const acid = ac.get('acid')
		const acname = ac.get('acname')
		const acfullname = ac.get('acfullname')
		const direction = ac.get('direction')

		// 从余额列表得到acid相同的项，可能存在多个辅助核算
		const filterAcbalist = acbalist.filter(v => v.get('acid') === acid)
		// 有无辅助核算
		const hasAss = ac.get('asscategorylist').size > 0
		const amount = filterAcbalist ? filterAcbalist.getIn([0, 'amount']) : ''
		const count = filterAcbalist ? filterAcbalist.getIn([0, 'beginCount']) : ''

		// 先过滤出当前ba下与ac.asscategorylist包含类别的辅助核算
		const asscategorylist = ac.get('asscategorylist')
		const filterAcAsslist = acasslist.filter(v => asscategorylist.indexOf(v.get('asscategory')) > -1)

		const assItemSizeArr = filterAcAsslist.size === 0 ? fromJS([]) : filterAcAsslist.map(v => v.get('asslist').size)
		const asslistSize = assItemSizeArr.size === 0 ? 0 : assItemSizeArr.reduce((v, pre) => v * pre)

		// 汇总子科目的金额
		const chirdrenList = acbalist.filter(v => v.get('acid').indexOf(acid) === 0)
		let totalAmont = 0
		let totalCount = 0
		chirdrenList.forEach(v => v.get('amount') ? totalAmont = totalAmont + (v.get('direction') === direction ? (v.get('amount') - 0) : -v.get('amount')) : '')
		chirdrenList.forEach(v => v.get('beginCount') ? totalCount = totalCount + (v.get('direction') === direction ? (v.get('beginCount') - 0) : -v.get('beginCount')) : '')

		return (
			<div className="qcye-wrap" style={style}>
				<div
					style={itemstyle}
					className="qcye-line"
					onClick={() => {
						dispatch(qcyeActions.toggleLowerQc(acid))
						if (filterAcbalist.size) {
							this.setState({showAsslist: !showAsslist})
						}
					}}
				>
					<span className="acname">
					{
						hasAss ?
						// <span>
							<Icon
								className="icon qcye-add-icon"
								type="add-plus-fill"
								color="#38ADFF"
								size="16"
								onClick={(e) => {
									e.stopPropagation()

									let asslist = [], i = 0, len = filterAcAsslist.size
									// let asslist = [], i = 0, len = asslistSize
									let source, asscategory, result

									if (!isExpanded)
										dispatch(qcyeActions.toggleLowerQc(acid))

									if (!showAsslist)
										this.setState({showAsslist: !showAsslist})

									;(function recurse(i, next) {
										if (!next || i >= len) {

											const asslistStr = asslist.map(v => v.asscategory + '' + v.assid)

											const assExi = filterAcbalist.some(v => {
												const asslist = v.get('asslist')

												return asslist.every(v => asslistStr.indexOf(v.get('asscategory') + '' + v.get('assid')) > -1)

											})

											if (assExi) {
												return thirdParty.Alert('该辅助核算已添加')
											} else {
												return dispatch(qcyeActions.insertAcBalance(idx, ac.set('asslist', fromJS(asslist))))
											}
											// return dispatch(qcyeActions.insertAcBalance(idx, ac.set('asslist', fromJS(asslist))))

										} else {
											// 获取辅助核算类别

											if (filterAcbalist.size >= asslistSize) {
												return thirdParty.Alert('所有辅助核算都已添加')
											}

											asscategory = filterAcAsslist.getIn([i, 'asscategory'])
											// 将类别插入到asslist里的ass中

											let source = []

											filterAcAsslist
												.getIn([i, 'asslist'])
												.forEach(v => source.push({
													key: [asscategory, v.get('assid'), v.get('assname')].join('_'),
													value: v.set('asscategory', asscategory)
												}))

											// source = source.filter(v => {
											// 	// 假设ass不存在
											// 	let assNotExisted = true
											//
											// 	filterAcbalist.some(w => w.get('asslist').some(u => {
											// 		// 若相同则说明ass存在
											// 		if (u.get('assid') === v.value.get('assid')) {
											// 			assNotExisted = false
											// 			// 通过返回true跳过剩下的循环
											// 			return true
											// 		} else {
											// 			return false
											// 		}
											// 	}))
											//
											// 	// 通过返回false过滤掉存在的ass
											// 	return assNotExisted
											// })

											// console.log('chosen', source);

											thirdParty.chosen({
												source : source,
												onSuccess(result) {
													const info = result.key.split('_')
													asslist.push({asscategory: info[0], assid: info[1], assname: info[2]})
													recurse(++i, true)
												},
												onFail() {
													recurse(undefined, false)
												}
											})
										}
									})(0, true)
								}}
								/>
							// </span>
							: ''
						}
						<span className="acname-acname">
							<span>
								{acid + '_' + acname}
							</span>
						</span>
						{
							hasSub || (hasAss && filterAcbalist.size) ?
							<span className="acname-down-icon">
								<Icon color="#ccc" type="arrow-down" style={{transform: isExpanded || showAsslist ? 'rotate(180deg)' : '', margin:'0.07rem 0.03rem 0 0'}}/>
							</span>
							:
							''
						}
					</span>
					<span className="direction">{direction === 'debit' ? '借' : '贷'}</span>
					<span className="amount">
					{
						hasAss || hasSub ?
							<Amount className="amount-content amount-total">{totalAmont}</Amount> :
							(ac.get('acunitOpen') == '1' ?
								(<div className="acunitOpen">
									<p>
										{/* 数字 */}
										<TextInput
											className="amount-content acunitOpen-input"
											style={count < 0 ? {color: 'red'} : undefined}
											onChange={value => {
												if(Math.abs(value) > 1000000){
													return alert('数量的长度不能超过6位')
												}
												dispatch(qcyeActions.changeAcBalanceCount(ac, value, '', unitDecimalCount))
											}}
											moneyKeyboardAlign="right"
											value={count ? (qcyeCountClickBool ? count : formatMoney(count, unitDecimalCount, '')) : ''}
											onBlur={e => this.setState({qcyeCountClickBool: false})}
											onFocus={e => {
												this.setState({qcyeCountClickBool: true})
											}}
										/>
										<span className="acunitOpen-acunit">{ac.get('acunit')}</span>
									</p>
									<hr className="acunitOpen-hr"/>
									<p>
										<TextInput
											className="amount-content acunitOpen-input"
											style={amount < 0 ? {color: 'red'} : undefined}
											type="text"
											moneyKeyboardAlign="right"
											onChange={value => {
												if(Math.abs(value) > 1000000000000){
													return alert('数量的长度不能超过12位')
												}
												dispatch(qcyeActions.changeBaAmount(ac, value))
											}}
											onBlur={e => {
												this.setState({qcyeClickBool: false})
											}}
											value={amount ? (qcyeClickBool ? amount : formatMoney(amount, 2, '')) : ''}
											onFocus={e => {
												this.setState({qcyeClickBool: true})
											}}
										/>
									</p>
								</div>
							) :
							<span className="amount-content" style={amount < 0 ? {color: 'red'} : undefined}>
								<TextInput
									type="text"
									moneyKeyboardAlign="right"
									onChange={value => dispatch(qcyeActions.changeBaAmount(ac, value))}
									onBlur={e => {
										this.setState({qcyeClickBool: false})
									}}
									value={amount ? (qcyeClickBool ? amount : formatMoney(amount, 2, '')) : ''}
									onFocus={e => {
										this.setState({qcyeClickBool: true})
									}}
								/>
							</span>
						)
					}
					</span>
				</div>
				{filterAcbalist.map((v, i) =>
					<AssBa
						style={{color:'#999', display: hasAss && showAsslist ? '' : 'none'}}
						baitem={v}
						key={i}
						ac={ac}
						dispatch={dispatch}
						acunitOpen={ac.get('acunitOpen') == '1'}
						acunit={ac.get('acunit')}
						unitDecimalCount={unitDecimalCount}
					/>
				)}
			</div>
		)
	}
}
