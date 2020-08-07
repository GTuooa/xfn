import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import * as assetsActions from 'app/redux/Config/Assets/assets.action.js'
import * as homeActions from 'app/redux/Home/home.action.js'

import { Amount, TableBody, TableTitle, TableAll } from 'app/components'
import JvCardItem from './JvCardItem'
import CardTableTitle from './CardTableTitle'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const {
			style,
			sortByValue,
			sortByStatus,
			dispatch,
			cardList,
			compareyear,
			comparemonth,
			cardItemStatus,
			cardCheckedAll,
			tabSelectedIndex
		} = this.props

		return (
			<TableAll type="zccongfig-table">
				{/* <i className="shadow-title-Assestscard"></i>
				资产卡片
				<JvTitleCardItem
					dispatch={dispatch}
					cardCheckedAll={cardCheckedAll}
				/> */}
				<CardTableTitle
					className="assetscard-tabel-width"
					sortByValue={sortByValue}
					sortByStatus={sortByStatus}
					selectAcAll={cardCheckedAll}
					dispatch={dispatch}
				/>
				<TableBody>
					{(cardList || []).map((v, i) =>{
						const  cardItemCheckedStatus=cardItemStatus.getIn([i,'status'])
						return <JvCardItem
								key={i}
								idx={i}
								cardItem={v}
								className="assetscard-tabel-width assetscard-tabel-justify"
								dispatch={dispatch}
								onClick={(cardNumber) => {
									sessionStorage.setItem("assetsCardfrom", "Assets")
									dispatch(assetsActions.getCardDetailFetch(cardNumber))
									dispatch(assetsActions.showAssetsCard(true))
									//dispatch(homeActions.addTabpane('AssetsCardOption'))
								}}
								compareyear={compareyear}
								comparemonth={comparemonth}
								cardItemCheckedStatus={cardItemCheckedStatus}
							/>
					})}
				</TableBody>
			</TableAll>
		)
	}
}
