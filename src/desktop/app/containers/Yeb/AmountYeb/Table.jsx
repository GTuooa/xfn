import React, { PropTypes } from 'react'
import { Map, List,toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import TableTit from './TableTit.jsx'
import KmItem from './KmItem.jsx'
import FzKmItem from './FzKmItem.jsx'
import { TableScrollWrap, TableScroll, TableBody, TitleKmye, TableAll, TablePagination, TableItem, Amount, Price } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const {
			dispatch,
			balanceaclist,
			issuedate,
			chooseperiods,
			endissuedate,
			isShow,
			amountYebChildShow,
			unitDecimalCount,
			kmBalanceaclist,
			beSupport,
			amountYebKmChildShow,
			assCategory,
			assTwoCategory,
			assIdTwo,
			assSecondName,
			acId,
			acname
		} = this.props

		const ulName = isShow ? 'spread' : 'noSpread'
		let count = 0
		const amount = beSupport?kmBalanceaclist.get(0):balanceaclist.get(0)

		return (
			<TableScrollWrap>
				<TableScroll className="table-ammountyeb-wrap">
					<TableAll type="amountYeb">
						<TableTit dispatch={dispatch} isShow={isShow} beSupport={beSupport}/>

						<TableBody className="table-ammountyeb-body">
							{
								!beSupport?
								balanceaclist.map((v, i) => {

									let type = ''
									let idShow = ''
									let nameShow = ''
									let line = 0
									let showArrow = false
									let arrowType = 'down'
									if (v.get('assid')) {
										type = 'assid'
										idShow = v.get('assid')
										nameShow = v.get('assname')
										line = amountYebChildShow.indexOf(v.get('acid')) > -1 ? ++count : 'hide'

									} else if (!v.get('assid') && v.get('asscategory')){
										type = 'asscategory'
										idShow = ''
										nameShow = v.get('asscategory')
										line = amountYebChildShow.indexOf(v.get('acid')) > -1 ? ++count : 'hide'

									} else {
										type = 'acid'
										idShow = v.get('acid')
										nameShow = v.get('acname')
										line = ++count
										showArrow = v.get('asslist') ? (v.get('asslist').size ? true : false) : false
										arrowType = amountYebChildShow.indexOf(v.get('acid')) > -1 ? 'up' : 'down'
									}

									return (<KmItem
										kmitem={v}
										// className='ammountyeb-table-width'
										className={[`ammountyeb-table-width-${ulName}`, v.get('disableTime') ? 'fzhs-item-disable' : ''].join(' ')}
										amountYebChildShow={amountYebChildShow}
										chooseperiods={chooseperiods}
										idx={i}
										key={i}
										dispatch={dispatch}
										issuedate={issuedate}
										endissuedate={endissuedate}
										isShow={isShow}
										idShow={idShow}
										nameShow={nameShow}
										line={line}
										showArrow={showArrow}
										arrowType={arrowType}
										type={type}
										unitDecimalCount={unitDecimalCount}
									/>)
								}):''
							}
							{
								beSupport?
								kmBalanceaclist.map((v,i) => {
									const arrowType = amountYebKmChildShow.indexOf(v.get('assId')) > -1 ? 'up' : 'down'
									const assId = v.get('assId')
									const assName = v.get('assName')
									return <div>
										<FzKmItem
	   									kmitem={v}
	   									// className='ammountyeb-table-width'
	   									className={[`ammountyeb-table-width-${ulName}`, v.get('disableTime') ? 'fzhs-item-disable' : ''].join(' ')}
	   									amountYebChildShow={amountYebKmChildShow}
	   									chooseperiods={chooseperiods}
	   									idx={i}
	   									key={i}
	   									dispatch={dispatch}
	   									issuedate={issuedate}
	   									endissuedate={endissuedate}
	   									isShow={isShow}
	   									idShow={v.get('assId')}
	   									nameShow={v.get('assName')}
	   									line={i}
	   									showArrow={v.get('baAcList') && v.get('baAcList').size}
	   									arrowType={arrowType}
	   									type={'assId'}
	   									unitDecimalCount={unitDecimalCount}
										assTwoCategory={assTwoCategory}
					                    assIdTwo={assIdTwo}
					                    assSecondName={assSecondName}
										assCategory={assCategory}
										acId={acId}
										acname={acname}
	   								/>
									{
										amountYebKmChildShow.indexOf(v.get('assId')) > -1 && v.get('baAcList') && v.get('baAcList').size?
										v.get('baAcList').map((v,ii) => {
										return	<FzKmItem
		   									kmitem={v}
		   									// className='ammountyeb-table-width'
		   									className={[`ammountyeb-table-width-${ulName}`, v.get('disableTime') ? 'fzhs-item-disable' : ''].join(' ')}
		   									amountYebChildShow={amountYebChildShow}
		   									chooseperiods={chooseperiods}
		   									idx={i}
		   									key={v.get('acId')}
		   									dispatch={dispatch}
		   									issuedate={issuedate}
		   									endissuedate={endissuedate}
		   									isShow={isShow}
		   									idShow={v.get('acId')}
		   									nameShow={v.get('acFullName')}
		   									line={i}
		   									type={'acId'}
		   									unitDecimalCount={unitDecimalCount}
											assCategory={assCategory}
											assTwoCategory={assTwoCategory}
						                    assIdTwo={assIdTwo}
						                    assSecondName={assSecondName}
											acId={acId}
											acname={acname}
											assId={assId}
											assName={assName}
		   								/>
									}):''
									}
									</div>

								}):''
							}
							<TableItem className={`ammountyeb-table-width-${ulName}`}>
								<li className="ammountyeb-table-one">
									<span>本期合计</span>
								</li>
								<li className="ammountyeb-table-two table-item-cur">
									<span></span>
								</li>

								<li className="ammountyeb-table-three">
									<span></span>
								</li>

								<li className="ammountyeb-table-four">
									<div className="ammountyeb-table-title-item">
										<span></span>
										<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount ? amount.get('openingCountTotal'):''}</Amount></span>
										<span className="ammountyeb-table-title-item-align-right"></span>
										<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount? amount.get('openingPriceTotal'):amount ? amount.get('openingbalanceDebitTotal') : ''}</Amount></span>
									</div>
								</li>
								<li className="ammountyeb-table-five">
									<div className="ammountyeb-table-title-item">
										<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount ? amount.get('debitCountTotal'):''}</Amount></span>
										<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount? amount.get('debitPriceTotal'):amount ? amount.get('debitTotal') : ''}</Amount></span>
									</div>
								</li>
								<li className="ammountyeb-table-six">
									<div className="ammountyeb-table-title-item">
										<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount ? amount.get('creditCountTotal'):''}</Amount></span>
										<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount? amount.get('creditPriceTotal'):amount ? amount.get('creditTotal') : ''}</Amount></span>
									</div>
								</li>
								{
									isShow ?
									<li className="ammountyeb-table-seven" >
										<div className="ammountyeb-table-title-item">
											<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount ? amount.get('debitSumCountTotal'):''}</Amount></span>
											<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount ? amount.get('debitSumPriceTotal'):amount ? amount.get('debitSumTotal') : ''}</Amount></span>
										</div>
									</li> :
									<li className="ammountyeb-table-show">....</li>

								}
								{
									isShow ?
									<li className="ammountyeb-table-eight">
										<div className="ammountyeb-table-title-item">
											<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount ? amount.get('creditSumCountTotal'):''}</Amount></span>
											<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount ? amount.get('creditSumPriceTotal'):amount ? amount.get('creditSumTotal') : ''}</Amount></span>
										</div>
									</li> : ''
								}

								<li className="ammountyeb-table-nine">
									<div className="ammountyeb-table-title-item">
										<span></span>
										<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount ? amount.get('closingCountTotal'):''}</Amount></span>
										<span className="ammountyeb-table-title-item-align-right"></span>
										<span className="ammountyeb-table-title-item-align-right"><Amount>{beSupport && amount ? amount.get('closingPriceTotal'):amount ? amount.get('closingbalanceDebitTotal') : ''}</Amount></span>
									</div>
								</li>
							</TableItem>
						</TableBody>
					</TableAll>
				</TableScroll>
			</TableScrollWrap>
		)
	}
}
