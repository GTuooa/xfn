import React, { PropTypes } from 'react'
import { List, toJS } from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import * as assconfigActions from 'app/redux/Config/Ass/assconfig.action'
import thirdParty from 'app/thirdParty'
import { Icon, SinglePicker } from 'app/components'

@immutableRenderDecorator
export default
class Title extends React.Component {

	render() {
		const {
			tabSelectedIndex,
			assTags,
			dispatch,
			tabSelectedAssCategory
		} = this.props

		return (
			<div className="tab-title-list">
				<SinglePicker
					className="tab-title"
					district={assTags.map((v, i) => ({key: v, value: i}))}
					onOk={(result) => {
						dispatch(assconfigActions.changeTabIndexAssConfig(result.value))
					}}
				>
					<div className="tab-title-select">
						<span>辅助类别：</span>
						<span className="select-result">{tabSelectedAssCategory}&nbsp;<Icon type="triangle"/></span>
					</div>
				</SinglePicker>
				{/* <div className="tab-title" onClick={() => {
					thirdParty.chosen({
						source: assTags.map((v, i) => ({key: v, value: i})),
						onSuccess: (result) => {
							dispatch(assconfigActions.changeTabIndexAssConfig(result.value))
						},
						onFail: (err) => {}
					})
				}}>
					<div className="tab-title-select">
						<span>辅助类别：</span>
						<span className="select-result">{tabSelectedAssCategory}&nbsp;<Icon type="triangle"/></span>
					</div>
					{/* <div className="tab-title-item">{assTags.filter(v => v !== tabSelectedAssCategory).join(' ')}</div> */}
				{/* {assTags.map((v, i) => {
					return (
						<span
							className={['tab-title-item', tabSelectedIndex === i ? 'selected' : ''].join(' ')}
							onClick={() => dispatch(assconfigActions.changeTabIndexAssConfig(i))}
							key={i}
							>
							{v}
						</span>
					)
				})}
				</div> */}
			</div>
		)
	}
}
