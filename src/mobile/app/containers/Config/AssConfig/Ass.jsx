import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as assAllActions from 'app/redux/Home/All/asslist.actions'
import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import { Checkbox, Icon } from 'app/components'

@immutableRenderDecorator
export default
class Ass extends React.Component {

	render() {
		const {
			idx,
			assitem,
			dispatch,
			acAssSelectedIndex,
			allAssCheckBoxDisplay,
			className,
			isEnd,
			history
		} = this.props
		//console.log('assitem-----',assitem)

		return (
			<div className="ass-item-wrap">
				<div
					className={["ass-item", className].join(' ')}
					style={{borderBottom: isEnd ? '0' : ''}}
					onClick={() => {
						if (allAssCheckBoxDisplay) {
							dispatch(assAllActions.selectAss(acAssSelectedIndex, idx))
						} else {
							dispatch(assconfigActions.beforeModifyAss(assitem, idx))
							history.push('/config/option/ass')
						}
					}}
					>
					<Checkbox
						className="checkbox"
						checkedColor="#fb6"
						style={{display: allAssCheckBoxDisplay ? '' : 'none'}}
						checked={assitem.get('selected')}
					/>
					<span className="ass-info">{[assitem.get('assid'), assitem.get('assname')].join(' - ')}</span>
					{/* <Icon className="icon" type="arrow-right"/> */}
					<span className="ass-item-right">
						<span>{assitem.get('disableTime') || assitem.get('disable') === 'TRUE' ? '已禁用' : ''}</span>
						<Icon className="icon" type="arrow-right"/>
					</span>
				</div>
			</div>
		);
	}
}
