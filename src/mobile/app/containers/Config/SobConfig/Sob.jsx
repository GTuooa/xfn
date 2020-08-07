import React, { PropTypes } from 'react'
import { Map, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as allActions from 'app/redux/Home/All/soblist.action'
import * as sobConfigActions from 'app/redux/Config/Sob/sobconfig.action'
import { Checkbox, Icon }	from 'app/components'

@immutableRenderDecorator
export default
class Sob extends React.Component {

	render() {
		const {
			idx,
			allCheckboxDisplay,
			sob,
			username,
			dispatch,
			isEnd,
			history,
			isAdmin
		} = this.props
		const isSobAdmin = sob.get('adminlist').some(v => v.get('name') === username)

		return (
			<div className="sob-item-wrap">
				<div
					className="sob-item"
					style={{borderBottom: isEnd ? '0' : ''}}
					onClick={() => {
						// if (allCheckboxDisplay) {
						// 	dispatch(allActions.selectSob(idx))
						// } else if (!allCheckboxDisplay) {
						// 	if (!sob.get('adminlist').some(v => v.get('name') === username))
						// 		return
						// 	dispatch(sobConfigActions.beforeModifySob(sob, idx))
						// } else {
						// 	return
						// }
						if (isSobAdmin || isAdmin) {
							dispatch(sobConfigActions.beforeInsertOrModifySob(sob.get('sobid'), history))
						}
					}}
					>
					<Checkbox className="checkbox" style={{display: allCheckboxDisplay ? 'inline-block' : 'none'}} checked={sob.get('selected')}/>
					<div className="sob-info">
						<p className={"sob-info-sobname"}>{sob.get('sobname')}</p>
						{/* <p className={["sob-info-sobname", isSobAdmin ? '' : 'sob-info-sobname-disabled'].join(' ')}>{sob.get('sobname')}</p> */}
					</div>
					<Icon className="icon" type="arrow-right"/>
				</div>
			</div>
		)
	}
}
