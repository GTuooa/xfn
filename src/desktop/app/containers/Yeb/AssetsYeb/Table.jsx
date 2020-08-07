import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import LrItem from './LrItem.jsx'
import { Amount, TableWrap, TableBody, TableItem, TableTitle, TableAll } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const {
			incomestatement,
			detailList,
			AssetsMainData,
			dispatch,
			AssetsConfigRowClick,
			detailChildShow,
			issuedate,
			endissuedate,
			chooseperiods
		} = this.props

		//  有下级的类别
		const upperidList = detailList ? detailList.map(v => v.get('upperAssetsNumber')) : ''
		let lineNum = 0

		const titleList = ['编码', '类别', '原值', '期初累计(折/摊)', '期初净值', '本期(折/摊)', '本年累计(折/摊)', '期末累计(折/摊)', '期末净值']

		return (
			<TableWrap notPosition={true}>
				<TableAll>
					<TableTitle
						titleList={titleList}
						className='assests-kmye-table-width assests-kmye-title-width'
					/>
					<TableBody>
						{
							(detailList || []).map((v, i) =>{
								const isShow = v.get('serialNumber').length === 1 || detailChildShow.indexOf(v.get('serialNumber').substr(0, 1)) > -1
								let line = isShow ? ++lineNum : 'hide'

								return (
									<LrItem
										className='assests-kmye-table-width'
										lrItem={v}
										key={i}
										line={line}
										isShow={isShow}
										upperidList={upperidList}
										AssetsConfigRowClick={AssetsConfigRowClick}
										dispatch={dispatch}
										issuedate={issuedate}
										endissuedate={endissuedate}
										chooseperiods={chooseperiods}
									/>
								)
							})
						}
						<TableItem className='assests-kmye-table-width' line={lineNum+1}>
							<li></li>
							<li>本期合计</li>
							<li><Amount>{AssetsMainData.get('cardValue')}</Amount></li>
							<li><Amount>{AssetsMainData.get('sumStarDepreciation')}</Amount></li>
							<li><Amount>{AssetsMainData.get('starNetWorth')}</Amount></li>
							<li><Amount>{AssetsMainData.get('currentDepreciation')}</Amount></li>
							<li><Amount>{AssetsMainData.get('yearDepreciation')}</Amount></li>
							<li><Amount>{AssetsMainData.get('sumEndDepreciation')}</Amount></li>
							<li><Amount>{AssetsMainData.get('endNetWorth')}</Amount></li>
						</TableItem>
					</TableBody>
				</TableAll>
			</TableWrap>
		)
	}
}

{/* <div className="layer">
	<i className="shadow-title-assetsdetail"></i>
	<ul className="assetsdetail-table-title">
		<li>编码</li>
		<li>类别</li>
		<li>原值</li>
		<li>期初累计（折/摊）</li>
		<li>期初净值</li>
		<li>本期（折/摊）</li>
		<li>本年累计（折/摊）</li>
		<li>期末累计（折/摊）</li>
		<li>期末净值</li>
	</ul>
	<div className="assetsdetail-table-body">
		{
			(detailList || []).map((v, i) =>{
				const isShow = v.get('serialNumber').length === 1 || detailChildShow.indexOf(v.get('serialNumber').substr(0, 1)) > -1
				let line = isShow ? ++lineNum : 'hide'

				return (
					<LrItem
						lrItem={v}
						key={i}
						line={line}
						isShow={isShow}
						upperidList={upperidList}
						AssetsConfigRowClick={AssetsConfigRowClick}
						dispatch={dispatch}
						detailIssuedate={detailIssuedate}
						detailYear={detailYear}
						detailMonth={detailMonth}
					/>
				)
			})
		}
		<ul className={`assetsdetail-table-item ${(lineNum+1)%2 === 0 ? 'assets-table-item-color' : ''}`}>
			<li></li>
			<li>本期合计</li>
			<li><Amount>{detailTotal.get('cardValue')}</Amount></li>
			<li><Amount>{detailTotal.get('sumStarDepreciation')}</Amount></li>
			<li><Amount>{detailTotal.get('starNetWorth')}</Amount></li>
			<li><Amount>{detailTotal.get('currentDepreciation')}</Amount></li>
			<li><Amount>{detailTotal.get('yearDepreciation')}</Amount></li>
			<li><Amount>{detailTotal.get('sumEndDepreciation')}</Amount></li>
			<li><Amount>{detailTotal.get('endNetWorth')}</Amount></li>
		</ul>
	</div>
</ */}
