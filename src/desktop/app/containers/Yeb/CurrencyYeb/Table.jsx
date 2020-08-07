import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'

import TableTit from './TableTit.jsx'
import CurrencyItem from './CurrencyItem.jsx'

import { TableScrollWrap, TableScroll, TableBody, TableAll, TablePagination } from 'app/components'

@immutableRenderDecorator
export default
class Table extends React.Component {

	render() {

		const {
            dispatch,
            isShow,
			currencyList,
			issuedate,
			endissuedate,
			chooseperiods,
			childitemlist
         } = this.props

		 const ulName = isShow ? 'spread' : 'noSpread'
		 const loop = (list,level) => {
			return list.map((u,i) => {
				const hasChild= u.get('baFcWithAcList').size > 0
				const showChild=childitemlist.indexOf(u.get('fcNumber')) > -1 
				if(hasChild){
					if (level===1) {
						return(
							<div>
								<CurrencyItem
									idx={i}
									isShow={isShow}
									className={`currencyYeb-table-width-${ulName}`}
									item={u}
									dispatch={dispatch}
									issuedate={issuedate}
									endissuedate={endissuedate}
									chooseperiods={chooseperiods}
									hasChild={hasChild}
									showChild={showChild}
									level={level}
		
								/>
								{
									showChild && loop(u.get('baFcWithAcList'),level+1)
								}
								</div>
							)
					} else{
						const showChild=childitemlist.indexOf(u.get('acid')) > -1 
						return(
							<div>
								<CurrencyItem
									idx={i}
									isShow={isShow}
									className={`currencyYeb-table-width-${ulName}`}
									item={u}
									dispatch={dispatch}
									issuedate={issuedate}
									endissuedate={endissuedate}
									chooseperiods={chooseperiods}
									hasChild={hasChild}
									showChild={showChild}
									level={level}
		
								/>
								{
									showChild && loop(u.get('baFcWithAcList'),level+1)
								}
								</div>
							)
					}
				}
				// if (hasChild) {
				// 	return(
				// 		<div>
				// 			<CurrencyItem
				// 				idx={i}
				// 				isShow={isShow}
				// 				className={`currencyYeb-table-width-${ulName}`}
				// 				item={u}
				// 				dispatch={dispatch}
				// 				issuedate={issuedate}
				// 				endissuedate={endissuedate}
				// 				chooseperiods={chooseperiods}
				// 				hasChild={hasChild}
				// 				showChild={showChild}
				// 				level={level}
	
				// 			/>
				// 			{
				// 				showChild && loop(u.get('baFcWithAcList'),level+1)
				// 			}
				// 			</div>
				// 		)
				// } 
				else {
					return(
						<CurrencyItem
								idx={i}
								isShow={isShow}
								className={`currencyYeb-table-width-${ulName}`}
								item={u}
								dispatch={dispatch}
								issuedate={issuedate}
								endissuedate={endissuedate}
								chooseperiods={chooseperiods}
								hasChild={false}
								showChild={showChild}
								level={level}
	
							/>
					)
				}
				
				})

		 }
		return (
			<TableScrollWrap>
				<TableScroll>
					<TableAll type="currencyYeb">
						<TableTit dispatch={dispatch} isShow={isShow}/>
						<TableBody className={'table-currencyYeb-body'}>
							{/* {
								currencyList.map((u,i) => {
									const hasChild= u.get('baFcWithAcList').size
									const showChild=childitemlist.indexOf(u.get('fcNumber')) > -1 
									return(
										<div>
											<CurrencyItem
												idx={i}
												isShow={isShow}
												className={`currencyYeb-table-width-${ulName}`}
												item={u}
												dispatch={dispatch}
												issuedate={issuedate}
												endissuedate={endissuedate}
												chooseperiods={chooseperiods}
												hasChild={hasChild}
												showChild={showChild}

											/>
											{
												u.get('baFcWithAcList').size && childitemlist.indexOf(u.get('fcNumber')) > -1?
												u.get('baFcWithAcList').map((v,ii) =>
													<CurrencyItem
														idx={ii}
														isShow={isShow}
														className={`currencyYeb-table-width-${ulName}`}
														item={v}
														dispatch={dispatch}
														issuedate={issuedate}
														endissuedate={endissuedate}
														chooseperiods={chooseperiods}
														hasChild={false}
														showChild={showChild}
													/>
													):''
											}
											</div>
									)
									
								})
							} */}
							{
								loop(currencyList,1)

							}
						</TableBody>
					</TableAll>
				</TableScroll>
			</TableScrollWrap>
		)
	}
}
