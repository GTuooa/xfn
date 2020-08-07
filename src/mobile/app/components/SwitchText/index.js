import React from 'react';
// import immutableRenderMixin from 'react-immutable-render-mixin';
import './index.less';

export default
class SwitchText extends React.Component {


	// getDefaultProps() {
	// 	return {
	// 		onChange: () => {},
	// 		size: 1
	// 	}
	// },
	// propTypes: {
	// 	checked: React.PropTypes.bool,
	// 	onChange: React.PropTypes.func,
	// 	size: React.PropTypes.number,
	// 	className: React.PropTypes.string
	// },
	render() {

		const { checked, style, className, onChange, size, checkedChildren, unCheckedChildren, ...other } = this.props

		return (
			<span
				{...other}
				className={`${checked ?'switch-text-switchChecked' : 'switch-text-switch'}${className ? ' ' + className : ''}`}
				onClick={() => onChange(!checked)}
				style={Object.assign({transform: `scale(${size})`}, style)}
				>
				<span className={'switch-text-inner'}>{checked ? checkedChildren : unCheckedChildren }</span>
			</span>
		)
	}
}
