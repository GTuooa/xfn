import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { message } from 'antd'
import XfnInput from 'app/components/XfnInput'
import { toJS, fromJS } from 'immutable'
import { formatMoney } from 'app/utils'
import { Amount, Icon } from 'app/components'
import thirdParty from 'app/thirdParty'

import * as qcyeActions	from 'app/redux/Config/Qcye/qcye.action.js'

@immutableRenderDecorator
export default
class AcBalanceItem extends React.Component {
	constructor() {
		super()
		this.state = { qcyeClickBool: false, qcyeCountClickBool: false }
	}
	render() {
		const {
			idx,
			acid,
			acbalist,
			acname,
			acfullname,
			asslist,
			direction,
			showadd,
			showclose,
			showInput,
			showCountInput,
			amount,
			count,
			dispatch,
			asscategorylist,
			nextItemExist,
			arrowDown,
			arrowClick,
			style,
			hasClosed,
			unitDecimalCount
		} = this.props
		const { qcyeClickBool, qcyeCountClickBool } = this.state

		const chirdrenList = !asslist ? acbalist.filter(v => v.get('acid').indexOf(acid) === 0) : fromJS([])
		let totalAmont = 0;
		chirdrenList.forEach(v => totalAmont = totalAmont + (v.get('direction') === direction ? (v.get('amount') - 0) : -v.get('amount')));
		let totalCount = 0;
		chirdrenList.forEach(v => totalCount = totalCount + (v.get('direction') === direction ? (v.get('beginCount') - 0) : -v.get('beginCount')));

		return (
			<ul style={style}>
				<li>
					{asslist ? `${acid}_${asslist.map(v => v.get('assid')).join('_')}` : acid}
					{nextItemExist ?
						<Icon type={arrowDown ? 'down' : 'up'} className="qcye-triangle" onClick={arrowClick}></Icon>
						: ''
					}
				</li>
				<li>
					{asslist ? `${acname}_${asslist.map(v => v.get('assname')).join('_')}` : acname}
					{
						showclose ? <Icon className="qcye-table-item-icon" type="close" onClick={() => {
							thirdParty.Confirm({
								message: `是否删除该科目的期初值？`,
								title: "提示",
								buttonLabels: ['取消', '确定'],
								onSuccess : (result) => {
									if (result.buttonIndex === 1) {
										dispatch(qcyeActions.deleteAcBalanceItem(idx))
									}
								}
							})
						}}/> :
						(showadd ? <Icon className="qcye-table-item-icon" type="plus" onClick={e => {
							if (arrowDown)
								arrowClick()

							dispatch(qcyeActions.beforeInsertAssAcBalanceItem(asscategorylist, acid))
							dispatch(qcyeActions.insertAcBalanceItem('' ,acid, acname, acfullname, direction))
						}}/> : '')
					}
				</li>
				<li>{direction === 'debit' ? '借' : '贷'}</li>
				<li>
					<ul>
						<li>
							{
								showCountInput && showInput ?
								<XfnInput
									type={'number'}
									autoSelect={true}
									showFormatMoney={true}
									disabled={hasClosed}
									value={count}
									decimalPlaces={unitDecimalCount} // 小数点位数
									onFocus={e => {
										e.target.value = count ? count : ''
									}}
									className="qcye-table-item-input"
									onChange={(e) =>{
										if(Math.abs(e.target.value) > 1000000){
											return message.warn('数量的长度不能超过6位')
										}
										if (idx !== undefined) {
											dispatch(qcyeActions.changeAcBalanceCount(e.target.value, idx))
										} else {
											dispatch(qcyeActions.insertAcBalanceItemCount(e.target.value, acid, acname, acfullname, direction))
										}
									}}
								/>
								:
								<span>&nbsp;<Amount className="qcye-table-item-span">{totalCount}</Amount></span>
							}
						</li>
						<li>
							{
								showInput ?
								<XfnInput
									type={'number'}
									autoSelect={true}
									showFormatMoney={true}
									disabled={hasClosed}
									style={{'textAlign': 'right'}}
									value={amount}
									decimalPlaces={'2'} // 小数点位数
									className="qcye-table-item-input"
									onFocus={e => {
										e.target.value = amount ? amount : ''
									}}
									onChange={(e) =>{
										if(Math.abs(e.target.value) > 1000000000000){
											return message.warn('数量的长度不能超过12位')
										}
										if (idx !== undefined) {
											dispatch(qcyeActions.changeAcBalanceAmount(e.target.value, idx))
										} else {
											dispatch(qcyeActions.insertAcBalanceItem(e.target.value, acid, acname, acfullname, direction))
										}
									}}
								/> : <Amount className="qcye-table-item-span">{totalAmont}</Amount>
							}
						</li>
					</ul>

				</li>
			</ul>
		)
	}
}
