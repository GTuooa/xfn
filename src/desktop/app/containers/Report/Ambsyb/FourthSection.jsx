import React, { PropTypes } from 'react'
import { Map, List, fromJS, toJS } from 'immutable'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { Amount } from 'app/components'
import { Icon } from 'app/components'
import * as ambsybActions from 'app/redux/Report/Ambsyb/ambsyb.action.js'
import LiLast from './LiLast'

@immutableRenderDecorator
export default
class FourthSection extends React.Component {

	constructor() {
		super()
		this.state = { offsetTop: ''}
	}

	render() {

		const { assName, ambDetailTable, tableShowChild, dispatch, scrollTop, offsetTop, showAssTable, onSeclect, isSpread } = this.props

		const isForOneMonth = ambDetailTable.get('isForOneMonth')
		const acTable = ambDetailTable.get('acTable') ? ambDetailTable.get('acTable') : fromJS([])

		const upIdList = acTable.map(v => v.get('upperId'))
		let count = 0

		return (
			<div className="ambsyb-fourthsection">
				<div className="ambsyb-fourthsection-title">
					{showAssTable ?
						<span className="ambsyb-thirdsection-title-title">
							<span
								className="title-conleft title-selectd"
								>
								损益汇总表
							</span>
							<span
								className="title-conleft"
								onClick={() => onSeclect()}
								>
								收支查询表
							</span>
						</span> :
						<h4 className="ambsyb-fourthsection-title-title">{assName}损益表</h4>
					}
				</div>
				<div className="ambsyb-table">
					<ul style={{display: scrollTop > offsetTop ? '' : 'none'}} className={`ambsyb-table-item ambsyb-table-title ambsyb-all-width ambsyb-ac-table-title-fixed ${isSpread ? 'ambsyb-ac-table-title-fixed-spread' : 'ambsyb-ac-table-title-fixed-nospread'}`}>
						<li>收支项</li>
						<li>
							<span>本年累计金额</span>
						</li>
						<li>
							<span>本期金额</span>
						</li>
						<li>
							<span>{isForOneMonth === 'TRUE' ? '环比上期涨幅情况' : '全年占比率'}</span>
						</li>
						<li>
							<span>同比上年涨跌幅情况</span>
						</li>
					</ul>
					<ul className="ambsyb-table-item ambsyb-table-title ambsyb-all-width"  ref="ambsybAssTitle">
						<li>收支项</li>
						<li>
							<span>本年累计金额</span>
						</li>
						<li>
							<span>本期金额</span>
						</li>
						<li>
							<span>{isForOneMonth === 'TRUE' ? '环比上期涨跌幅情况' : '全年占比率'}</span>
						</li>
						<li>
							<span>同比上年涨跌幅情况</span>
						</li>
					</ul>
					{
						acTable.map((v, i) => {

							const isDisplay = !v.get('upperId') || tableShowChild.indexOf(v.get('upperId')) > -1
							const arrowType = tableShowChild.indexOf(v.get('acId')) > -1 ? 'up' : 'down'
							const line = isDisplay ? count++ : 'hide'

							return <ul
								key={i}
								className={line !== 'hide' && line%2 === 0 ? `ambsyb-table-item ambsyb-all-width` : `ambsyb-table-item ambsyb-all-width ambsyb-table-item-color`}
								style={{display: isDisplay ? '' : 'none'}}
								// onClick={() => v.get('acId').length >= 4 && dispatch(ambsybActions.changeTableShowChild(v.get('acId')))}
								>
								<li onClick={() => v.get('acId').length >= 4 && dispatch(ambsybActions.changeTableShowChild(v.get('acId')))}>
									<span
										className={v.get('acId').length == 2 ? "ambsyb-table-strong" : `ambsyb-table-children${v.get('acId').length}`}
										>
										{v.get('name')}
									</span>
									<Icon style={{display: (upIdList.indexOf(v.get('acId')) > -1) ? '' : 'none'}} className="ambsyb-table-item-icon" type={arrowType}/>
								</li>
								<li>
									<Amount className="ambsyb-all-amonut">{v.get('yearAmount')}</Amount>
								</li>
								<li>
									<Amount className="ambsyb-all-amonut">{v.get('currentAmount')}</Amount>
								</li>
								<LiLast
									isForOneMonth={isForOneMonth}
									increaseAmount={v.get('increaseAmount')}
									increaseScaleAmount={v.get('increaseScaleAmount')}
									propYearAmount={v.get('propYearAmount')}
								/>
								<LiLast
									isForOneMonth={isForOneMonth}
									increaseAmount={v.get('yearIncreaseAmount')}
									increaseScaleAmount={v.get('increaseYearScaleAmount')}
									propYearAmount={v.get('propYearAmount')}
								/>
								{/* {
									isForOneMonth === 'TRUE' ?
									<li>
										<span className={v.get('increaseAmount') > 0 ? 'ambsyb-all-text-red' : 'ambsyb-all-text-blue'}>

											<span>{`${v.get('increaseAmount') > 0 ? '+' : ''} ${v.get('increaseAmount')} `}</span>
											<span className="ambsyb-all-text-gray">
												(
													{v.get('increaseScaleAmount') === -9999 ? '' : (v.get('increaseScaleAmount') >= 0 ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />) }
													{`${v.get('increaseScaleAmount') === -9999 ? '--' : (v.get('increaseScaleAmount') + '%')}`}
												)
											</span>

										</span>
									</li> :
									<li>
										<span className={v.get('propYearAmount') > 0 ? 'ambsyb-all-text-red' : 'ambsyb-all-text-blue'}>
											{`${v.get('propYearAmount')} %`}
										</span>
									</li>
								} */}
							</ul>
						})
					}
				</div>
			</div>
		)
	}
}
