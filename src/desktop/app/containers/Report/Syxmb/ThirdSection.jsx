import React, { PropTypes } from 'react'
import { Map, List, fromJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { TreeSelect, Input, Icon } from 'antd'
import { Amount } from 'app/components'
//import * as ambsybActions from 'app/redux/Report/Ambsyb/ambsyb.action.js'
import * as syxmbActions from 'app/redux/Report/Syxmb/syxmb.actions.js'
import { changeAmbAclistToTree } from 'app/utils'
import LiLast from './LiLast'

@immutableRenderDecorator
export default
class ThirdSection extends React.Component {

	render() {

		const { ambDetailTable, dispatch, currentAc, issuedate, endissuedate, cardUuid, scrollTop, offsetTop, onSeclect, isSpread,unit } = this.props

		const isForOneMonth = ambDetailTable.get('isForOneMonth')
		const assTable = ambDetailTable.get('assTable')
		const acIdList = ambDetailTable.get('acIdList') ? ambDetailTable.get('acIdList') : fromJS([])
		const totalLine = ambDetailTable.get('totalLine')

		return (
			<div className="ambsyb-thirdsection">
				<div className="ambsyb-thirdsection-title">
					<span className="ambsyb-thirdsection-title-title">
						<span
							className="title-conleft"
							onClick={() => onSeclect()}
							>
							损益汇总表
						</span>
						<span className="title-conleft title-selectd">
							收支查询表
						</span>
					</span>
					<span className="ambsyb-thirdsection-serch">
						<span className="ambsyb-thirdsection-title-label">收支项：</span>
						<span className="ambsyb-thirdsection-title-select">
							<TreeSelect
								style={{width: 150}}
								value={currentAc}
								dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
								treeData={changeAmbAclistToTree(acIdList.toJS())}
								placeholder="损益净额"
								onSelect={(info) => {
									dispatch(syxmbActions.selectSyxmbCurrentAc(issuedate, endissuedate, cardUuid, info))
								}}
							/>
						</span>
					</span>
				</div>
				<div className="ambsyb-table">
					<ul
						style={{display: scrollTop > offsetTop ? '' : 'none'}}
						className={`ambsyb-table-item ambsyb-table-title ambsyb-all-width ambsyb-ac-table-title-fixed ${isSpread ? 'ambsyb-ac-table-title-fixed-spread' : 'ambsyb-ac-table-title-fixed-nospread'}`}
						>
						<li>阿米巴对象</li>
						<li onClick={() => dispatch(syxmbActions.syxmbSortBySortName('yearAmountSort', 'yearAmount'))}>
							<span>本年累计金额</span>
							<span className="amb-sort-icon"></span>
						</li>
						<li onClick={() => dispatch(syxmbActions.syxmbSortBySortName('currentAmountSort', 'currentAmount'))}>
							<span>本期金额</span>
							<span className="amb-sort-icon"></span>
						</li>
						<li onClick={() => {
							if (isForOneMonth === 'TRUE') {
								dispatch(syxmbActions.syxmbSortBySortName('increaseAmountSort', 'increaseAmount'))
							} else {
								dispatch(syxmbActions.syxmbSortBySortName('propYearAmountSort', 'propYearAmount'))
							}
						}}>
							<span>{isForOneMonth === 'TRUE' ? '环比上期涨幅情况' : '全年占比率'}</span>
							<span className="amb-sort-icon"></span>
						</li>
						<li onClick={() => {
							if (isForOneMonth === 'TRUE') {
								dispatch(syxmbActions.syxmbSortBySortName('yearIncreaseAmountSort', 'yearIncreaseAmount'))
							} else {
								dispatch(syxmbActions.syxmbSortBySortName('propYearAmountSort', 'propYearAmount'))
							}
						}}>
							<span>同比上年涨跌幅情况</span>
							<span className="amb-sort-icon"></span>
						</li>
					</ul>
					<ul className="ambsyb-table-item ambsyb-table-title ambsyb-all-width" ref="ambsybAcTitle">
						<li>阿米巴对象</li>
						<li onClick={() => dispatch(syxmbActions.syxmbSortBySortName('yearAmountSort', 'yearAmount'))}>
							<span>本年累计金额</span>
							<span className="amb-sort-icon"></span>
						</li>
						<li onClick={() => dispatch(syxmbActions.syxmbSortBySortName('currentAmountSort', 'currentAmount'))}>
							<span>本期金额</span>
							<span className="amb-sort-icon"></span>
						</li>
						<li onClick={() => {
							if (isForOneMonth === 'TRUE') {
								dispatch(syxmbActions.syxmbSortBySortName('increaseAmountSort', 'increaseAmount'))
							} else {
								dispatch(syxmbActions.syxmbSortBySortName('propYearAmountSort', 'propYearAmount'))
							}
						}}>
							<span>{isForOneMonth === 'TRUE' ? '环比上期涨跌幅情况' : '全年占比率'}</span>
							<span className="amb-sort-icon"></span>
						</li>
						<li onClick={() => {
							if (isForOneMonth === 'TRUE') {
								dispatch(syxmbActions.syxmbSortBySortName('yearIncreaseAmountSort', 'yearIncreaseAmount'))
							} else {
								dispatch(syxmbActions.syxmbSortBySortName('propYearAmountSort', 'propYearAmount'))
							}
						}}>
							<span>同比上年涨跌幅情况</span>
							<span className="amb-sort-icon"></span>
						</li>
					</ul>
					{
						assTable.size>0&&assTable.map((v, i) =>
							<ul key={i} className={i%2 === 0 ? `ambsyb-table-item ambsyb-all-width` : `ambsyb-table-item ambsyb-all-width ambsyb-table-item-color`}>
								<li>
									<span>{v.get('name')}</span>
								</li>
								<li>
									<Amount className="ambsyb-all-amonut">{v.get('yearAmount')/unit}</Amount>
								</li>
								<li>
									<Amount className="ambsyb-all-amonut">{v.get('currentAmount')/unit}</Amount>
								</li>
								<LiLast
									isForOneMonth={isForOneMonth}
									increaseAmount={v.get('increaseAmount')/unit}
									increaseScaleAmount={v.get('increaseScaleAmount')}
									propYearAmount={v.get('propYearAmount')}
								/>
								<LiLast
									isForOneMonth={isForOneMonth}
									increaseAmount={v.get('yearIncreaseAmount')/unit}
									increaseScaleAmount={v.get('increaseYearScaleAmount')}
									propYearAmount={v.get('propYearAmount')}
								/>
							</ul>
						)
					}
					<ul className={assTable.size%2 === 0 ? `ambsyb-table-item ambsyb-all-width` : `ambsyb-table-item ambsyb-all-width ambsyb-table-item-color`}>
						<li>
							<span>{totalLine.get('name')}</span>
						</li>
						<li>
							<Amount className="ambsyb-all-amonut">{totalLine.get('yearAmount')/unit}</Amount>
						</li>
						<li>
							<Amount className="ambsyb-all-amonut">{totalLine.get('currentAmount')/unit}</Amount>
						</li>
						<LiLast
							isForOneMonth={isForOneMonth}
							increaseAmount={totalLine.get('increaseAmount')/unit}
							increaseScaleAmount={totalLine.get('increaseScaleAmount')}
							propYearAmount={totalLine.get('propYearAmount')}
						/>
						<LiLast
							isForOneMonth={isForOneMonth}
							increaseAmount={totalLine.get('yearIncreaseAmount')/unit}
							increaseScaleAmount={totalLine.get('increaseYearScaleAmount')}
							propYearAmount={totalLine.get('propYearAmount')}
						/>
					</ul>
				</div>
			</div>
		)
	}
}
