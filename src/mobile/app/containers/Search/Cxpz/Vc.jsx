import React, { PropTypes } from 'react'

import * as cxpzActions from 'app/redux/Search/Cxpz/cxpz.action'
// import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'
import * as lrpzExportActions from 'app/redux/Edit/Lrpz/lrpzExport.action.js'
import * as acAllActions from 'app/redux/Home/All/aclist.actions'
import { Checkbox, Icon, Amount }	from 'app/components'

export default
class Vc extends React.Component {

	render() {
		const {
			allCheckboxDisplay,
			idx,
			vcitem,
			dispatch,
			history,
			vclist,
			intelligentStatus
		} = this.props

		const closedby = vcitem.get('closedby')
		const reviewedby = vcitem.get('reviewedby')

		return (
			<div
				className="vc"
				onClick={() => {
					if (allCheckboxDisplay) {
						// if (vcitem.get('reviewedby'))
						// 	return
						dispatch(cxpzActions.selectVc(idx))
					} else {
						//dispatch(cxpzActions.pushVouhcerToLrpzReducer(vcitem))
						sessionStorage.setItem('lrpzHandleMode', 'modify')
						history.push('/lrpz')
						sessionStorage.setItem('router-from', 'cxpz')
						// dispatch(lrpzExportActions.setCkpzIsShow(true))
						dispatch(lrpzExportActions.getFjFetch(vcitem,vclist))
					}
				}}
				>
				{/* {vcitem.get('reviewedby') ? <Icon type='yishenhe' className="cxpz-shenhe-icon" size='40' color="#ff943e"/> : ''} */}
				<Icon style={{display: closedby ? '' : 'none'}} className="cxpz-shenhe-icon " color="#DE4646" type="the-invosing" size="50"/>
				<Icon style={{display: closedby ? 'none' :  (reviewedby ? '' : 'none')}} className="cxpz-shenhe-icon" color="#ff943e" type="yishenhe" size="45"/>
				<div className="vc-info">
					<span>
						<Checkbox
							// disabled={vcitem.get('reviewedby') ? true : false}
							style={{'paddingRight': '10px', 'display': allCheckboxDisplay ? 'inline-block' : 'none'}} checked={vcitem.get('selected')}
						/>
						<span className="text-underline">记 {vcitem.get('vcindex')} 号</span>
						<Icon style={{'display': vcitem.get('enclosurecount') ? '' : 'none', 'marginLeft': '10px'}} color="#858E99" type="fujian" />
					</span>
					<span className="vc-info-date">{vcitem.get('vcdate').replace(/-/g,'/')}</span>
				</div>
				<div className="vc-jv-list">
					{vcitem.get('jvlist').map((w, j) => {
						return (
							<div className="vc-jv" key={j}>
								<div className="vc-jv-info">
									<span className="vc-jv-direction">{[w.get('jvdirection') === 'debit' ? '借' : '贷', '：', w.get('acfullname')].join('')}</span>
									{/*<span className="vc-jv-amount" style={{color: w.get('jvamount') < 0 ? "red" : undefined}}>{w.get('jvamount')}</span>*/}
									<Amount className="vc-jv-amount" showZero={true}>{w.get('jvamount')}</Amount>
								</div>
								{
									w.get('asslist').size ?
									<div className="vc-jv-ass">
										{
											w.get('asslist').map((v, i) =>
												<div key={i} className={`vc-jv-ass-showtext ${i === 0 ? 'vc-jv-ass-showtext-tip' : ''}`}>
													{`${v.get('asscategory')+ '_' + v.get('assid') + ' ' + v.get('assname')}`}
												</div>
											)
										}
									</div>
									: ''
								}
								<div className="vc-jv-abstract">
									<span>摘要：</span>
									<span>{w.get('jvabstract')}</span>
								</div>
							</div>
						)
					})}
				</div>
				<div className="vc-info vc-info-bottom">
					<span>{`制单人: ${vcitem.get('createdby') ? vcitem.get('createdby') : ''}`}</span>
					<span>{vcitem.get('reviewedby') && !intelligentStatus ? `审核人: ${vcitem.get('reviewedby')}` : ''}</span>
				</div>
			</div>
		)
	}
}
