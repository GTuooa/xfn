import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Amount, Icon } from 'app/components'
import * as assMxbActions from 'app/redux/Mxb/AssMxb/assMxb.action'
import * as assYebActions from 'app/redux/Yeb/AssYeb/assYeb.action.js'

const colorLevel = {
	4: '#fff',
	6: '#D1C0A5',
	8: '#7E6B5A',
	10: '#59493f'
}

@immutableRenderDecorator
export default
class Ba extends React.Component {

	render() {
		const {
			ba,
			dispatch,
			issuedate,
			endissuedate,
			line,
			showchilditem,
			kmyeAssCategory,
			acId,
			idx,
			oldAssKmyebList,
			className,
			assIdTwo,
			doubleAssCategory,
			history
		} = this.props
		const showTriangle = ba.get('showchilditem') == false || ba.get('showchilditem')
		const isshowchilditem = (showchilditem && ba.get('showchilditem'))
		const articlePaddingLeft = (ba.get('assid').length - 4) / 200 * 10 + 'rem'
		const flagColor = colorLevel[ba.get('assid').length]

		const flagstyle = {
			width: articlePaddingLeft,
			background: flagColor
		}
		let acid = ba.get('assid')
		let upperAssid = ba.get('upperAssid')
		if(acid == upperAssid){
			acid = acId
		}
		let oldIdx = idx
		return (
			<div className={['ba', className].join(' ')} style={{display: line !== 'hide' ? '' : 'none',
				background: ba.get('isWrap') ? '':'rgb(254, 243, 227)'}}>
				<div>
					<span
						className='name'
						onClick={(e) => {
							// e.stopPropagation()
							sessionStorage.setItem('previousPage', 'assYeb')
							dispatch(assMxbActions.getAssMxbAclistAndReportdetailFetch(issuedate, endissuedate, acid, ba.get('upperAssid'), kmyeAssCategory, assIdTwo, doubleAssCategory))
							history.push('/assmxb')
						}}
						>
						{articlePaddingLeft == '0rem' || ba.get('isWrap') ? '' : <span className="ac-flag" style={flagstyle}></span>}
						<span className='name-name'>{ba.get('assid') + '_' + ba.get('assname')}</span>
					</span>
					<span
						className='triangle'
						onClick={(e) => {
							if(showTriangle){
								// e.stopPropagation()
								oldAssKmyebList.forEach((v,i) => {
									if(v.get('assid') === ba.get('assid') && v.get('wrapId') === ba.get('wrapId')){
										oldIdx = i
									}
								})
								dispatch(assYebActions.showAssKmyebChildItiem(oldIdx))
							}
						}}
						>
						<Icon
							type="arrow-down"
							style={{display : showTriangle ? '' : 'none', transform: isshowchilditem ? 'rotate(180deg)' : ''}}
						/>
					</span>
				</div>
				<div className='ba-info'>
					<Amount showZero={true}>{ba.get('debitOpeningBalance') || -ba.get('creditOpeningBalance') || 0}</Amount>
					<Amount showZero={true}>{ba.get('debit')}</Amount>
					<Amount showZero={true}>{ba.get('credit')}</Amount>
					<Amount showZero={true}>{ba.get('debitClosingBalance') || -ba.get('creditClosingBalance') || 0}</Amount>
				</div>
			</div>
		)
	}
}
