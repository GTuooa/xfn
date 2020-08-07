import React, { PropTypes } from 'react'
// import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Row, Icon } from 'app/components'
import * as lrpzActions from 'app/redux/Edit/Lrpz/lrpz.action.js'

// @immutableRenderDecorator
export default
class Title extends React.Component {
	// static propTypes = {
	// 	dispatch: PropTypes.func,
	// 	closedby: PropTypes.bool,
	// 	reviewedby: PropTypes.bool,
	// 	showckpz: PropTypes.bool,
	// 	vcindex: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
	// 	creditTotal: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
	// 	debitTotal: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
	// }
	render() {
		const {
			vcindex,
			dispatch,
			creditTotal,
			debitTotal,
			closedby,
			reviewedby,
			showckpz,
			locked,
			vcdate
		} = this.props
		const isEnterDraft = sessionStorage.getItem('enterDraft') === 'draft' ? true : false

		return (
			<Row className={['title', isEnterDraft ? 'lrpz-locked' : ''].join(' ')}>
				<div className="title-item title-item-left">
					{/* <p className="title-item-vcindex"> */}
					<p className={['title-item-vcindex', isEnterDraft ? 'draft-vcindex' : ''].join(' ')}>
						<span>记 </span>
						<input
							disabled={showckpz}
							style={showckpz ? {background: isEnterDraft ? '#fff' : '#DEDEDE', border: isEnterDraft ? '0' : '', color: isEnterDraft && locked == '1' ? '#999' : '#222'} : undefined}
							className="vc-index"
							type="tel"
							value={vcindex}
							onChange={e => dispatch(lrpzActions.changeVcId(e.target.value))}
						/>
						<span> 号</span>
					</p>
					<p className="draft-vcdate" style={{display: isEnterDraft ? 'block' : 'none'}}>
						{vcdate.replace(/\-/g, '/')}
					</p>
				</div>
				<Icon style={{display: sessionStorage.getItem('enterDraft') === 'draft' && locked === '1' ? '' : 'none'}} className="locked-icon" color="#ff943e" type="locked" size="50"/>
				<Icon style={{display: closedby ? '' : 'none'}} className="title-item-icon" color="#DE4646" type="the-invosing" size="67"/>
				<Icon style={{display: closedby ? 'none' :  (reviewedby ? '' : 'none')}} className="title-item-icon title-item-icon-yishenhe" color="#ff943e" type="yishenhe" size="50"/>
				<div className="title-item title-item-right">
					<p>借方合计: {debitTotal}</p>
					<p>贷方合计: {creditTotal}</p>
				</div>
			</Row>
		)
	}
}
//
