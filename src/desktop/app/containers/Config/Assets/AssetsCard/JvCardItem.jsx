import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import { Icon, Checkbox }	from 'antd'
import { Amount, TableItem, TableOver } from 'app/components'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'

@immutableRenderDecorator
export default
class JvCardItem extends React.Component {

	render() {

		const {
			dispatch,
			cardItem,
			cardItemCheckedStatus,
			idx,
			onClick,
			compareyear,
			comparemonth,
			className
		} = this.props

		let statusText = '';
		const status = cardItem.get('status')

		if (status === '0') {
			statusText = '正常使用'
		} else if (status === '1') {
			statusText = '清理中'
		} else if (status == '2') {
			statusText = '已清理'
		} else if (status == '3') {
			statusText = '折旧完毕'
		} else if (status == '4') {
			statusText = '已删除'
		}


		const cardYear = Number(cardItem.get('inputPeriod').substr(0, 4))
		const cardMonth = Number(cardItem.get('inputPeriod').substr(6, 2))

		// const abledClick = cardYear > compareyear ? false : (cardMonth > comparemonth ? false : true)
		const abledClick = cardYear > compareyear ? false : (cardYear == compareyear ? (cardMonth > comparemonth ? false : true) : true)
		// const abledClick = true

		return (
			<TableItem className={abledClick ? className : `${className} assetscard-tabel-item-disabled`} line={idx+1}>
				<li>
					<Checkbox
						checked={cardItemCheckedStatus}
						onChange={() => {
							dispatch(assetsActions.selectOneCardButton(idx))
						}}
					/>
				</li>
				<TableOver isLink={abledClick ? true : false} onClick={() => abledClick && onClick(cardItem.get('cardNumber'))}>{cardItem.get('cardNumber')}</TableOver>
				<TableOver textAlign="left" isLink={abledClick ? true : false} onClick={() => abledClick && onClick(cardItem.get('cardNumber'))}>{cardItem.get('cardName')}</TableOver>
				<li><Amount>{cardItem.get('cardValue')}</Amount></li>
				<TableOver>{cardItem.get('salvage') + '%'}</TableOver>
				<TableOver>{cardItem.get('startTime').replace(/\/n*/g,"-")}</TableOver>
				<TableOver>{cardItem.get('inputPeriod').substr(0,4)+'-'+cardItem.get('inputPeriod').substr(6,2)}</TableOver>
				<TableOver textAlign="left">{cardItem.get('debitName')}</TableOver>
				<TableOver textAlign="left">{cardItem.get('creditName')}</TableOver>
				<li><Amount>{cardItem.get('monthlyDepreciation')}</Amount></li>
				<TableOver>{status !== '2' ? statusText : `已清理${cardItem.get('clearCardYear')}-${cardItem.get('clearCardMonth')}`}</TableOver>
			</TableItem>
		);
	}
}
